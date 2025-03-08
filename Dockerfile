# Step 1: Build the frontend app using Node.js v22.13.1
FROM node:22.13.1-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to install dependencies
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the production-ready files
RUN npm run build

# Debug: List the contents of the build directory
RUN ls -la /app/dist || echo "Dist directory not found"

# Install a static server like `serve`
RUN npm install -g serve

# Expose the port (8081 in this case)
EXPOSE 8081

# Serve the production build from dist/
CMD ["serve", "-s", "dist", "-l", "8081"]