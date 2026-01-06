# Base image
FROM node:20-alpine AS base

# ----------------------------
# Dependencies stage
# ----------------------------
FROM base AS deps
WORKDIR /app
# Copy package files (including package-lock.json if available)
COPY package.json package-lock.json* ./
RUN npm install

# ----------------------------
# Builder stage: build the Next.js app
# ----------------------------
FROM base AS builder
WORKDIR /app
# Copy installed node_modules from deps
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the app's source code
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ----------------------------
# Runner stage: production image
# ----------------------------
FROM base AS runner
WORKDIR /app

# Accept build-time arguments (passed through docker-compose)
ARG NEXT_PUBLIC_SANITY_PROJECT_ID
ARG NEXT_PUBLIC_SANITY_DATASET
ARG SANITY_API_READ_WRITE_TOKEN

# Set runtime environment variables based on build args
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=${NEXT_PUBLIC_SANITY_PROJECT_ID} \
    NEXT_PUBLIC_SANITY_DATASET=${NEXT_PUBLIC_SANITY_DATASET} \
    SANITY_API_READ_WRITE_TOKEN=${SANITY_API_READ_WRITE_TOKEN} \
    NEXT_TELEMETRY_DISABLED=1

# Copy static assets
# Reduce image size by only copying necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src ./src
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Environment variables
ENV NODE_ENV production

# Inform Docker and users that the container listens on port 3000
EXPOSE 3000

CMD ["npm", "start"]