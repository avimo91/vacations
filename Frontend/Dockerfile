
# Node.js 24:
FROM node:24-alpine

# Project folder:
WORKDIR /app

# Install dependencies:
COPY package*.json ./
RUN npm ci

# Copy source code:
COPY . .

# Frontend port:
EXPOSE 5173

# Start Vite:
CMD ["npm", "start", "--", "--host", "0.0.0.0"]
