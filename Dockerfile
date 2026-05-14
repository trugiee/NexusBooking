# ============================================================
#  Dockerfile — NEXUS7101 Booking System
#  Stage 1: Build Vite frontend
#  Stage 2: PHP + Apache for production
# ============================================================

# --- Stage 1: Build Frontend ---
FROM node:20-alpine AS builder
RUN apk add --no-cache python3 make g++
WORKDIR /app
# Copy only frontend-related files for building
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# --- Stage 2: PHP + Apache ---
FROM php:8.3-apache

# Install SQLite support
RUN apt-get update && apt-get install -y \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-install pdo_sqlite

# Enable Apache modules
RUN a2enmod rewrite

# Copy built Vite frontend → Apache web root
COPY --from=builder /app/dist /var/www/html

# Copy PHP backend → outside web root (secure)
COPY backend/php-server /var/www/php-server

# Copy Apache config
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf

# Copy startup script
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Set permissions
RUN chown -R www-data:www-data /var/www && \
    chmod -R 755 /var/www && \
    chmod -R 777 /var/www/php-server

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
CMD ["apache2-foreground"]
