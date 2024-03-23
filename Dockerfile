# Use an official Node.js runtime as the base image
FROM node:20.11.1-alpine3.19

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Copy the rest of the application code to the container
COPY . .

# ENV NODE_ENV=production

# Install project dependencies
RUN npm install

# Expose the port the GraphQL application will run on
EXPOSE 4000

# Start the GraphQL server
CMD ["npm", "start"]
 