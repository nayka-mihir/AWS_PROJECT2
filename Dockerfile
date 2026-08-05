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

COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci --only=production

COPY backend/ ./

COPY --from=frontend-builder /app/frontend/dist ./public

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node","src/server.js"]



