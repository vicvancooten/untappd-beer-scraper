# Use the official lightweight Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN yarn install

# Install necessary packages for Puppeteer to run Chrome
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Set the PUPPETEER_SKIP_CHROMIUM_DOWNLOAD variable
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define environment variable
ENV DUOLINGO_USER=YOUR_DUOLINGO_USERNAME
ENV SECRET=

# Command to run the application
CMD ["yarn", "start"]
