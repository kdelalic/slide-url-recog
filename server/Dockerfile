FROM node:12-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN ls

EXPOSE 8080
CMD [ "node", "." ]