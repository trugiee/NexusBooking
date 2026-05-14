#!/bin/bash
# ============================================================
#  entrypoint.sh — Handle Railway's dynamic PORT env variable
# ============================================================

# Railway injects PORT env variable. Apache listens on 80 by default.
# If Railway sets a different PORT, update Apache's config.

PORT=${PORT:-80}

# Update Apache to listen on the correct port
sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

echo "NEXUS7101: Starting Apache on port ${PORT}..."

# ---------------------------------------------------------------------------
# MPM safety check — abort early if more than one MPM module is loaded.
# Multiple MPMs cause "AH00534: More than one MPM loaded" and a hard crash.
# ---------------------------------------------------------------------------
MPM_COUNT=$(apache2 -M 2>/dev/null | grep -c 'mpm_' || true)
if [ "${MPM_COUNT}" -gt 1 ]; then
    echo "ERROR: More than one Apache MPM is loaded (found ${MPM_COUNT})." >&2
    echo "       Only mpm_prefork should be active. Aborting." >&2
    apache2 -M 2>&1 | grep 'mpm_' >&2
    exit 1
fi
echo "NEXUS7101: MPM check passed (${MPM_COUNT} MPM loaded)."

# Set .env path for PHP (load from /var/www/.env)
export APP_ROOT=/var/www

# Execute the CMD (apache2-foreground)
exec "$@"
