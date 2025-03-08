FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

EXPOSE 3002

CMD ["npm", "run", "dev"]