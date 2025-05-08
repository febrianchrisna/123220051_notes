FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies with verbose output for better debugging
RUN npm install --production --verbose || (echo "npm install failed" && exit 1)

# Copy the rest of the application
COPY . .

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]