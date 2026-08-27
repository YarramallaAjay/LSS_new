# --- Build stage -----------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /build

COPY package*.json ./
RUN npm install

COPY . .

# Vite bakes VITE_* env vars into the JS bundle at build time (there is no
# "runtime env" for a static SPA), so it's passed as a build arg here rather
# than a normal container env var. Override with:
#   docker build --build-arg VITE_API_BASE_URL=https://api.example.com .
ARG VITE_API_BASE_URL=http://localhost:8080
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# --- Runtime stage -----------------------------------------------------------
FROM nginx:1.27-alpine
COPY --from=build /build/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
