# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.12.0

# Base image with Node
FROM node:${NODE_VERSION}-alpine AS base

# Set working directory
WORKDIR /projects/basic-fe-nextjs

################################################################################
# Install production dependencies
FROM base AS deps

# Install dependencies
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

################################################################################
# Build the application
FROM deps AS build

# Install dev dependencies
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copy application files
COPY . .

# Run build script
RUN npm run build && ls -al ./

################################################################################
# Minimal runtime environment
FROM base AS final

# Set working directory for the final stage
WORKDIR /projects/basic-fe-nextjs

# Set production environment
ENV NODE_ENV=production

# Run as non-root
USER node

# Copy package.json and httpsServer.js to the current working directory (inside /projects/basic-fe-nextjs)
COPY package.json ./
COPY httpsServer.js ./
COPY app/config ./app/config

RUN ls -al ./
RUN ls -al ./app/config/https

# Copy node_modules and built .next
COPY --from=deps /projects/basic-fe-nextjs/node_modules ./node_modules
COPY --from=build /projects/basic-fe-nextjs/.next ./.next

# Expose application port
EXPOSE 3000

# Run the app
#CMD npm run dev-https
CMD ["npm", "run", "dev-https"]
