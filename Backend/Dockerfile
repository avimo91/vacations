
# Node.js 24:
FROM node:24-alpine

# Project folder:
WORKDIR /app

# Install dependencies:
COPY package*.json ./
RUN npm ci

# Copy source code:
COPY . .

# Backend port:
EXPOSE 4000

# Start backend:
CMD ["npm", "start"]
