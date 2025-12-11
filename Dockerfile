# Stage 1: Build the React (Vite) application
FROM node:20.10-alpine AS build

# Environment variables
ENV NODE_OPTIONS="--max-old-space-size=8192"
ENV NODE_ENV="live"
ENV DEBUG="vite:* vite build"

WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

RUN npm ci || npm ci || npm ci

# Copy project source code
COPY . .

# Build the application for production
RUN npm run build -- --mode production

# Stage 2: Serve React application with Nginx
FROM nginx:stable-alpine

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy compiled dist folder
COPY --from=build /app/dist /usr/share/nginx/html

# Create Nginx cache and temp directories and set permissions
RUN mkdir -p /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R 777 /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html

EXPOSE 8080

# Start Nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]