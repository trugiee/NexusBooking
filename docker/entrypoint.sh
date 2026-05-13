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

# Set .env path for PHP (load from /var/www/.env)
export APP_ROOT=/var/www

# Execute the CMD (apache2-foreground)
exec "$@"
