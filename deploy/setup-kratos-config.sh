#!/bin/bash

# Script to generate Kratos configuration with proper values

set -e

echo "🔧 Configuring Kratos with domain-specific values..."
echo "   Domain: $DOMAIN"

# Generate configuration file with proper substitutions
cat > /tmp/kratos.yml << EOF
version: v0.13.0

dsn: sqlite:///var/lib/sqlite/db.sqlite?_fk=true

serve:
  public:
    base_url: https://kratos.${DOMAIN}/
    cors:
      enabled: true
      allowed_origins:
        - https://admin.${DOMAIN}
      allowed_methods:
        - POST
        - GET
        - PUT
        - PATCH
        - DELETE
      allowed_headers:
        - Authorization
        - Content-Type
        - X-Session-Token
      exposed_headers:
        - Content-Type
        - Set-Cookie
  admin:
    base_url: http://kratos:4434/

selfservice:
  default_browser_return_url: https://admin.${DOMAIN}/
  allowed_return_urls:
    - https://admin.${DOMAIN}
    - https://admin.${DOMAIN}/dashboard

  methods:
    password:
      enabled: true
    totp:
      config:
        issuer: ${APP_NAME:-Kratos Admin UI}
      enabled: true
    lookup_secret:
      enabled: true
    link:
      enabled: true
    code:
      enabled: true

  flows:
    error:
      ui_url: https://admin.${DOMAIN}/error

    settings:
      ui_url: https://admin.${DOMAIN}/settings
      privileged_session_max_age: 15m
      required_aal: highest_available

    recovery:
      enabled: true
      ui_url: https://admin.${DOMAIN}/recovery
      use: code

    verification:
      enabled: true
      ui_url: https://admin.${DOMAIN}/verification
      use: code
      after:
        default_browser_return_url: https://admin.${DOMAIN}/

    logout:
      after:
        default_browser_return_url: https://admin.${DOMAIN}/login

    login:
      ui_url: https://admin.${DOMAIN}/login
      lifespan: 10m

    registration:
      lifespan: 10m
      ui_url: https://admin.${DOMAIN}/registration
      after:
        password:
          hooks:
            - hook: session

log:
  level: ${KRATOS_LOG_LEVEL:-info}
  format: json
  leak_sensitive_values: false

secrets:
  cookie:
    - ${KRATOS_COOKIE_SECRET}
  cipher:
    - ${KRATOS_CIPHER_SECRET}

ciphers:
  algorithm: xchacha20-poly1305

hashers:
  algorithm: bcrypt
  bcrypt:
    cost: 8

identity:
  default_schema_id: default
  schemas:
    - id: default
      url: file:///etc/config/kratos/identity.schema.json
    - id: organizational
      url: file:///etc/config/kratos/company-identity.schema.json
    - id: customer
      url: file:///etc/config/kratos/customer.schema.json

courier:
  smtp:
    connection_uri: smtp://smtp:1025/?disable_starttls=true
EOF

# Move the generated config to the proper location
mv /tmp/kratos.yml ./config/kratos/kratos.yml

echo "✅ Kratos configuration updated with domain: ${DOMAIN}"