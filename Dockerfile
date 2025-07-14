# Stage 1: Build dependencies only
FROM node:20-alpine AS deps

WORKDIR /app

# Only copy the package files
COPY package*.json ./

# Install only production dependencies
RUN npm install


# Stage 2: Final image with only backend code and node_modules
FROM node:20-alpine

WORKDIR /app

# Copy only backend source code
COPY server ./server

# Copy installed node_modules from deps
COPY --from=deps /app/node_modules ./node_modules

# Set working directory to server (for CMD)
WORKDIR /app/server

EXPOSE 5000

CMD ["node", "index.js"]
