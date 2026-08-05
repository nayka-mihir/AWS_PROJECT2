# frontend part
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

copy frontend/ ./
RUN npm run build

# backend part
FROM node:18-alpine AS final 
WORKDIR /app

# Install wget for healthcheck (already included in Alpine)
RUN apk add --no-cache wget

COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci --only=production

COPY backend/ ./

COPY --from=frontend-builder /app/frontend/dist ./public

EXPOSE 5000

ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --spider -q http://localhost:5000/api/health || exit 1

CMD ["node","src/server.js"]



