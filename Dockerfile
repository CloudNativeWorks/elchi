# Serve pre-built React (Vite) bundle with Nginx.
# The dist/ folder is produced by the release workflow and downloaded
# from the GitHub release before this image is built.

FROM nginx:stable-alpine

ARG APP_VERSION=unknown
LABEL org.opencontainers.image.title="Elchi" \
      org.opencontainers.image.version="${APP_VERSION}"

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy pre-built dist (produced by release workflow)
COPY dist /usr/share/nginx/html

# Create Nginx cache and temp directories and set permissions
RUN mkdir -p /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R 777 /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
