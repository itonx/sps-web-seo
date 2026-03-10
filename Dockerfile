# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS builder
WORKDIR /app

# Install only from lockfile for reproducible builds.
COPY package.json package-lock.json ./
RUN npm ci --include=optional && npm cache clean --force

COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:5001/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
