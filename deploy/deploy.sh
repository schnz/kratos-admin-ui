#!/bin/bash

# Production deployment script for Kratos Admin UI

set -e

echo "🚀 Kratos Admin UI Production Deployment"
echo "========================================"

# Navigate to deploy directory
cd "$(dirname "$0")"

# Check if .env.prod exists
if [ ! -f ".env.prod" ]; then
    echo "❌ .env.prod file not found!"
    echo "Please copy .env.prod.example to .env.prod and configure it."
    exit 1
fi

# Load environment variables (initial load)
export $(cat .env.prod | grep -v '^#' | xargs)

echo "✅ Environment loaded"

# Create external network if it doesn't exist
if ! docker network ls | grep -q "web"; then
    echo "🌐 Creating external network 'web'..."
    docker network create web
else
    echo "✅ Network 'web' already exists"
fi

# Generate basic auth hashes if not provided
if [ -z "$TRAEFIK_BASIC_AUTH" ] || [ "$TRAEFIK_BASIC_AUTH" = "admin:\$apr1\$hash\$here" ]; then
    echo "🔐 Generating basic auth for admin interfaces..."
    echo "Please enter username for admin dashboards:"
    read -r ADMIN_USER
    echo "Please enter password for admin dashboards:"
    read -s ADMIN_PASS
    BASIC_AUTH=$(htpasswd -nb "$ADMIN_USER" "$ADMIN_PASS")
    sed -i "s|TRAEFIK_BASIC_AUTH=.*|TRAEFIK_BASIC_AUTH=$BASIC_AUTH|" .env.prod
    sed -i "s|SMTP_BASIC_AUTH=.*|SMTP_BASIC_AUTH=$BASIC_AUTH|" .env.prod
fi

# Set hardcoded Kratos secrets for demo (exactly 32 characters)
echo "🔑 Setting Kratos secrets..."
KRATOS_COOKIE_SECRET="abcdef1234567890abcdef1234567890"
KRATOS_CIPHER_SECRET="fedcba0987654321fedcba0987654321"

# Update the env file
sed -i "s/KRATOS_COOKIE_SECRET=.*/KRATOS_COOKIE_SECRET=$KRATOS_COOKIE_SECRET/" .env.prod
sed -i "s/KRATOS_CIPHER_SECRET=.*/KRATOS_CIPHER_SECRET=$KRATOS_CIPHER_SECRET/" .env.prod

echo "✅ Secrets configured"

# Reload environment variables after secret generation
echo "🔄 Reloading environment variables..."
export $(cat .env.prod | grep -v '^#' | xargs)

# Create .env file for Docker Compose
echo "📝 Creating .env file for Docker Compose..."
cp .env.prod .env

# Configuration is already set with hardcoded values
echo "🔧 Using pre-configured Kratos settings..."

# Pull latest images
echo "📦 Pulling latest images..."
docker compose pull

# Start services
echo "🚀 Starting services..."
docker compose up -d

# Initialize demo identities
echo "🎭 Initializing demo identities..."
docker compose --profile init up init-identities

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "Your services are now running at:"
echo "  Admin UI:        https://admin.$DOMAIN"
echo "  Kratos Public:   https://kratos.$DOMAIN"
echo "  Kratos Admin:    http://kratos:4434 (internal only)"
echo "  Traefik:         https://traefik.$DOMAIN"
echo "  Mail:            https://mail.$DOMAIN"
echo ""
echo "🎭 Demo accounts created:"
echo "  Admin:    admin@$DOMAIN / admin123!"
echo "  Customer: customer@example.com / customer123!"
echo "  User:     user@example.com / user123!"
echo ""
echo "📋 Next steps:"
echo "1. Configure your DNS to point to this server"
echo "2. Wait for Let's Encrypt certificates to be issued"
echo "3. Access the admin UI and start managing identities"
echo ""
echo "📊 Monitor deployment:"
echo "  docker compose logs -f"
