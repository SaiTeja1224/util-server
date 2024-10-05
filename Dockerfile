# Use the Bun image as the base
FROM oven/bun:1 AS base

# Set the working directory
WORKDIR /app

# Stage for installing production dependencies
FROM base AS install
RUN mkdir -p /prod
COPY package.json bun.lockb /prod/
RUN cd /prod && bun install --frozen-lockfile --production

# Release stage to prepare the production image
FROM base AS release
COPY --from=install /prod/node_modules ./node_modules
COPY . .

# Change ownership of the /app directory to the 'bun' user
RUN chown -R bun:bun /app

# Switch to the 'bun' user
USER bun

# Expose the application port
EXPOSE 5002

# Set the command to run your application
CMD ["bun", "run", "dev"]