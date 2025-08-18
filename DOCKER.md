# Docker Setup for Astro Project

This project includes Docker configuration for containerized development and production deployment.

## Quick Start

### Production Build
```bash
# Build and run the production container
docker-compose up astro-app

# Or build manually
docker build -t astro-app .
docker run -p 4321:4321 astro-app
```

### Development Mode
```bash
# Run in development mode with hot reload
docker-compose --profile dev up astro-dev
```

## Docker Commands

### Build the image
```bash
docker build -t astro-app .
```

### Run the container
```bash
docker run -p 4321:4321 astro-app
```

### Run in detached mode
```bash
docker run -d -p 4321:4321 --name astro-container astro-app
```

### Stop and remove container
```bash
docker stop astro-container
docker rm astro-container
```

## Multi-Stage Build

The Dockerfile uses a multi-stage build approach:

1. **Dependencies Stage**: Installs production dependencies
2. **Builder Stage**: Installs all dependencies and builds the application
3. **Runner Stage**: Creates a minimal production image with only necessary files

## Security Features

- Non-root user (`astro`) for running the application
- Minimal Alpine Linux base image
- Only production dependencies in final image
- Health checks for container monitoring

## Environment Variables

- `NODE_ENV`: Set to `production` in production container
- `PORT`: Application port (default: 4321)

## Health Check

The container includes a health check endpoint at `/health` that returns:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Ports

- **4321**: Main application port

## Volumes

In development mode, the source code is mounted as a volume for hot reloading.

## Troubleshooting

### Container won't start
Check the logs:
```bash
docker logs <container-name>
```

### Port already in use
Change the port mapping in docker-compose.yml:
```yaml
ports:
  - "3000:4321"  # Map host port 3000 to container port 4321
```

### Build fails
Ensure you have the latest dependencies:
```bash
npm install
```
