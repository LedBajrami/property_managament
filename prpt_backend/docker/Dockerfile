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

# ✅ Install Redis extension (phpredis)
RUN pecl install redis && docker-php-ext-enable redis

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Create system user to run Composer and Artisan Commands
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user

# Create /var/www directory and set permissions
RUN mkdir -p /var/www && chown -R $user:$user /var/www

# Set working directory
WORKDIR /var/www

# Switch to user
USER $user

CMD ["php-fpm"]

EXPOSE 9000
