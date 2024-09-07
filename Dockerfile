# Use the official Node.js image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
# This allows Docker to cache npm install step if dependencies don't change
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the application (if necessary, e.g., for TypeScript or front-end build steps)
# RUN npm run build

# Expose the port on which the application will run
EXPOSE 3000

# Command to run the application
CMD [ "node", "index.js" ]
