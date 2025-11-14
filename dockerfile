# Use official Node image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install system dependencies for building sqlite3
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    sqlite3 \
    libsqlite3-dev \
 && rm -rf /var/lib/apt/lists/*

# Copy package files first (better caching)
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Rebuild sqlite3 for Linux platform
RUN npm rebuild sqlite3 --build-from-source

# Copy remaining source files
COPY . .

# Expose your app port (if you use 3000)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]