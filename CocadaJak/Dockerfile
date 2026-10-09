FROM php:8.3-apache

RUN apt-get update && apt-get install -y \
    libpq-dev libzip-dev libicu-dev unzip git \
    && docker-php-ext-install pdo pdo_pgsql zip intl

RUN a2enmod rewrite
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html
COPY . .
RUN composer install --no-dev --optimize-autoloader --no-interaction
RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80
CMD php artisan config:cache && php artisan migrate --force && apache2-foreground