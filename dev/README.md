# Kratos Admin UI Development Setup

This Docker Compose setup provides a complete development environment for testing the Kratos Admin UI with Ory Kratos.

## Services

- **kratos-admin-ui**: The Next.js admin interface (port 3000)
- **kratos**: Ory Kratos identity server (ports 4433/4434)
- **kratos-selfservice-ui**: Official Kratos self-service UI (port 4455)
- **mailslurper**: Email testing server (ports 4436/4437)

## Identity Schemas

The setup includes three identity schemas:

1. **default** (`identity.schema.json`): Basic person schema with email, username, first_name, last_name, phone

2. **organizational** (`company-identity.schema.json`): Simplified organizational user schema with:
   - Employee ID, name, department, role
   - Employment status (active, inactive, on_leave)

3. **customer** (`customer.schema.json`): E-commerce customer schema with:
   - Customer ID, contact information, date of birth
   - Shipping address and preferences
   - Loyalty tier and account status

## Quick Start

### Development Mode (Build from Source)

1. Start all services in development mode:

   ```bash
   cd dev
   docker compose -f docker-compose.yml -f docker-compose.override.dev.yml up -d
   ```

### Production Mode (Use Pre-built Image)

1. Start all services with production image:

   ```bash
   cd dev
   docker compose -f docker-compose.yml -f docker-compose.override.prod.yml up -d
   ```

### Common Steps (Both Modes)

2. Create test identities (first time only):

   ```bash
   # For development mode
   docker compose -f docker-compose.yml -f docker-compose.override.dev.yml --profile init up init-identities

   # For production mode
   docker compose -f docker-compose.yml -f docker-compose.override.prod.yml --profile init up init-identities
   ```

   This creates 37 test identities:
   - 15 person identities (default schema)
   - 10 organizational identities (employees)
   - 12 customer identities (e-commerce)

3. Access the services:
   - Admin UI: http://localhost:3000
   - Kratos Self-Service UI: http://localhost:4455
   - Kratos Admin API: http://localhost:4434
   - Kratos Public API: http://localhost:4433
   - MailSlurper: http://localhost:4436

4. Stop services:

   ```bash
   # For development mode
   docker compose -f docker-compose.yml -f docker-compose.override.dev.yml down

   # For production mode
   docker compose -f docker-compose.yml -f docker-compose.override.prod.yml down
   ```

## Re-creating Test Data

To recreate test identities:

### Development Mode

```bash
# Remove existing data
docker compose -f docker-compose.yml -f docker-compose.override.dev.yml down -v

# Start services and create identities
docker compose -f docker-compose.yml -f docker-compose.override.dev.yml up -d
docker compose -f docker-compose.yml -f docker-compose.override.dev.yml --profile init up init-identities
```

### Production Mode

```bash
# Remove existing data
docker compose -f docker-compose.yml -f docker-compose.override.prod.yml down -v

# Start services and create identities
docker compose -f docker-compose.yml -f docker-compose.override.prod.yml up -d
docker compose -f docker-compose.yml -f docker-compose.override.prod.yml --profile init up init-identities
```

## Override Configurations

### Admin UI Service Modes

The admin UI service is separated into development and production modes using override files:

#### Development Mode (`docker-compose.override.dev.yml`)

- **Build from Source**: Builds the application from local source code
- **Hot Reload**: Volume mounts for instant code changes
- **Development Environment**: Optimized for development with faster rebuilds
- **Environment Variables**: Includes `NEXT_PUBLIC_*` variables for client-side configuration

#### Production Mode (`docker-compose.override.prod.yml`)

- **Pre-built Image**: Uses `dhiagharsallaoui/kratos-admin-ui:latest` from Docker Hub
- **Optimized Performance**: Production-optimized Next.js standalone build
- **No Volume Mounts**: Runs entirely from the Docker image
- **Runtime Configuration**: Environment variables configured at container runtime

### SELinux Systems

For systems with SELinux enabled, use the appropriate SELinux override file for each mode:

```bash
# Development with SELinux
docker compose -f docker-compose.yml -f docker-compose.override.dev.yml -f docker-compose.override.selinux.dev.yml up -d

# Production with SELinux
docker compose -f docker-compose.yml -f docker-compose.override.prod.yml -f docker-compose.override.selinux.prod.yml up -d
```

**SELinux Override Files:**

- `docker-compose.override.selinux.dev.yml` - SELinux configuration for development mode (includes admin UI volume mounts)
- `docker-compose.override.selinux.prod.yml` - SELinux configuration for production mode (only Kratos volumes, no admin UI mounts)

### Benefits of This Approach

**Development Mode Benefits:**

- Instant code changes without rebuilding
- Full development environment with debugging tools
- Source code mounted for real-time editing

**Production Mode Benefits:**

- Testing the exact production image locally
- Faster startup (no build time required)
- Identical to production deployment
- Smaller attack surface (no development tools)

## Development

When using development mode (`docker-compose.override.dev.yml`), the admin UI container mounts the source code as a volume, so changes are reflected immediately without rebuilding the container.

## Environment Variables

The admin UI is configured with:

- `NEXT_PUBLIC_KRATOS_ADMIN_URL=http://localhost:4434`
- `NEXT_PUBLIC_KRATOS_PUBLIC_URL=http://localhost:4433`

## Troubleshooting

- Ensure ports 3000, 4433, 4434, 4455, 4436, and 4437 are not in use
- Check logs:

  ```bash
  # Development mode
  docker compose -f docker-compose.yml -f docker-compose.override.dev.yml logs [service-name]

  # Production mode
  docker compose -f docker-compose.yml -f docker-compose.override.prod.yml logs [service-name]
  ```

- Rebuild containers (development mode only):
  ```bash
  docker compose -f docker-compose.yml -f docker-compose.override.dev.yml up --build
  ```
