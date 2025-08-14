FROM node:18

WORKDIR /app

# Copy package files first
COPY package*.json ./
COPY tsconfig.json ./
COPY nodemon.json ./

# Install dependencies IN the container (gets Linux versions)
RUN npm install

# Copy source code but exclude node_modules
COPY src ./src
# COPY public ./public  
# Don't copy node_modules or package-lock.json

EXPOSE 3000

CMD ["npm", "run", "dev"]