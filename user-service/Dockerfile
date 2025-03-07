FROM node:latest

WORKDIR /usr/src/app

# Copy necessary files first
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# Generate Prisma Client
RUN npx prisma generate

COPY . .

EXPOSE 3000

# Run Prisma generate before starting the app
CMD ["sh", "-c", "npx prisma generate && npm run dev"]
