#!/bin/bash
# Substitute the PROXY_PASS_HOST environment variable into the Apache config file
sed -i "s|PROXY_PASS_HOST_PLACEHOLDER|${PROXY_PASS_HOST}|g" /etc/apache2/sites-available/000-default.conf


# Execute the original CMD
exec "$@"
