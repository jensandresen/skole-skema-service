FROM node:alpine

WORKDIR /app

COPY src/package*.json ./
RUN npm install

COPY src/*.js* ./

ENTRYPOINT [ "npm", "start" ]