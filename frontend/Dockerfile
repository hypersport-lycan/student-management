# Stage 1: Build the React/Vite application
FROM node:24-alpine AS builder
WORKDIR /app

# Define the build argument
ARG VITE_API_URL
# Make the argument available as an environment variable during the build step
ENV VITE_API_URL=$VITE_API_URL

# Copy and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build the app
COPY . .
RUN npm run lint && npm run build

# Stage 2: Serve the static files using Nginx
FROM nginx:alpine
# Vite outputs files to the "dist" folder by default
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
