# Use an explicit, lightweight Node.js base image
FROM node:24-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy dependency manifests first to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies (speeds up build and keeps image small)
RUN npm ci --only=production

# Copy the rest of your backend source code
COPY . .

# Expose the port your Express/Node app listens on
EXPOSE 5000

# Define the environment variable to ensure production optimizations
ENV NODE_ENV=production

# Start the application
CMD ["node", "src/server.js"]
