FROM node:20-alpine

# Set working directory
WORKDIR /app

# Debug: List contents to see what files we have
RUN ls -la

# Copy entire app first - this ensures package.json is available
COPY . .

# Debug: List contents after copy
RUN ls -la && echo "Contents of directory after copy"

# Install dependencies with error handling
RUN npm install --production || (echo "npm install failed - listing directory contents:" && ls -la && exit 1)

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]