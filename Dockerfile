# Multi-stage Dockerfile for Astro project
# Stage 1: Dependencies
FROM node:22-slim AS deps
WORKDIR /app

# Install dependencies only when needed
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

# Stage 2: Build
FROM node:22-slim AS builder
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 3: Production runtime
FROM node:22-slim AS runner
WORKDIR /app

# Create non-root user for security
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 --gid nodejs astro

# Copy built application from builder stage
COPY --from=builder --chown=astro:nodejs /app/dist ./dist
COPY --from=builder --chown=astro:nodejs /app/package.json ./

# Install only production dependencies
COPY --from=deps --chown=astro:nodejs /app/node_modules ./node_modules

# Set user
USER astro

# Expose port
EXPOSE 4321

# Start the application
CMD ["node", "dist/server/entry.mjs"]
