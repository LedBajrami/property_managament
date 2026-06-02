FROM php:8.2-fpm
ARG user=prpt_backend_susr
ARG uid=1002

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    zip \
    iputils-ping \
    unzip \
    zlib1g-dev \
    libzip-dev

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Create system user
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user

RUN mkdir -p /var/www && \
    mkdir -p /var/www/storage && \
    mkdir -p /var/www/bootstrap/cache && \
    chown -R $user:www-data /var/www && \
    chmod -R 775 /var/www/storage && \
    chmod -R 775 /var/www/bootstrap/cache

# Copy and register entrypoint
COPY --chown=$user:www-data entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /var/www

USER $user

ENTRYPOINT ["entrypoint.sh"]
CMD ["php-fpm"]
EXPOSE 9000
