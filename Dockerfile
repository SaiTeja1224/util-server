# Use the Bun image as the base
FROM oven/bun:1 AS base

# Set the working directory
WORKDIR /app

# Create the node_modules directory
RUN mkdir -p node_modules

# Stage for installing development dependencies
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Stage for installing production dependencies
FROM base AS install-prod
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Pre-release stage to copy everything and set up the app
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules ./node_modules
COPY . .

# Release stage to prepare the production image
FROM base AS release
COPY --from=install-prod /temp/prod/node_modules ./node_modules
COPY --from=prerelease /app .

# Change ownership of the /app directory to the 'bun' user
RUN chown -R bun:bun /app

# Switch to the 'bun' user
USER bun

# Expose the application port
EXPOSE 5002

# Set the command to run your application
CMD ["bun","--watch", "run", "index.ts"]