# Stage 1: Build dependencies
FROM node:20-alpine AS deps

WORKDIR /app

# Copy only package files from root
COPY package*.json ./

# Install production dependencies
RUN npm install


# Stage 2: Final backend image
FROM node:20-alpine

WORKDIR /app

# Copy backend source code
COPY server ./server

# Copy .env file into the backend folder
COPY .env ./server/.env

# Copy installed node_modules from deps
COPY --from=deps /app/node_modules ./node_modules

# Set working directory to backend folder
WORKDIR /app/server

EXPOSE 5000

# Start the server
CMD ["node", "index.js"]
