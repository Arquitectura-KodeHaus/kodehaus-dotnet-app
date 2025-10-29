# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Argumentos de build
ARG BACKEND_URL

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .

ENV NODE_OPTIONS=--max_old_space_size=4096

# Crear environment file con la URL del backend
RUN mkdir -p src/environments && \
    echo "export const environment = { production: true, apiUrl: '$BACKEND_URL' };" > src/environments/environment.prod.ts

# Verificar el contenido
RUN cat src/environments/environment.prod.ts

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
