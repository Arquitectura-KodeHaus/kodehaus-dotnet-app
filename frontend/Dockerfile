# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Argumentos de build
ARG BACKEND_URL

COPY package*.json ./
RUN npm ci --legacy-peer_deps

COPY . .

ENV NODE_OPTIONS=--max_old_space_size=4096

# ✅ USAR COMILLAS DOBLES para que la variable se expanda
RUN mkdir -p src/environments && \
    echo "export const environment = { production: true, apiUrl: \"$BACKEND_URL\" };" > src/environments/environment.prod.ts

# Verificar el contenido (esto te ayudará a debuggear)
RUN echo "=== Environment file content ===" && \
    cat src/environments/environment.prod.ts && \
    echo "==============================="

# Build
RUN npm run build -- --configuration production

# Production stage
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

# Copiar desde el path correcto del angular.json: dist/frontend-new
COPY --from=builder /app/dist/frontend-new /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
