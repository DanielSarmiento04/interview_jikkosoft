# Stage 1: Build the Angular application
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and lock file
COPY package*.json bun.lockb* ./

# Install ALL dependencies (including devDependencies for build)
# Using npm install since we have bun.lockb but building with Node
RUN npm install

# Copy application source
COPY . .

# Build the Angular app for production
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:1.27-alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from build stage
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
