#!/bin/sh
set -e

if [ ! -f /var/www/vendor/autoload.php ]; then
    echo "vendor/ not found, running composer install..."
    mkdir -p /var/www/vendor
    composer install --no-interaction --optimize-autoloader
fi

exec "$@"
