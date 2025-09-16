FROM node:22.12-alpine

# Create app directory and set proper ownership
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Copy package files first for better caching
COPY --chown=nextjs:nodejs package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy the rest of the application
COPY --chown=nextjs:nodejs . .

# Expose Vite dev server port (default 5173) and preview port
EXPOSE 5173
EXPOSE 4173

# Start the dev server
CMD ["npm", "run", "dev"]