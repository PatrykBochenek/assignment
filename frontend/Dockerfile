FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Set NODE_ENV to development for dev server
ENV NODE_ENV development

# Expose the port Next.js runs on
EXPOSE 3000

# Use npm run dev for development
CMD ["npm", "run", "dev"]