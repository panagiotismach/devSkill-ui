# Step 1: Build the frontend app using a Node.js image
FROM node:16-alpine as build

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

# Step 2: Serve the app using Nginx (lighter than running Node in production)
FROM nginx:alpine

# Copy the build files from the build stage to the Nginx directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to access the application
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
