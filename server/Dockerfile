FROM node:12-alpine

WORKDIR /usr/src/app

ENV COMPUTER_VISION_SUBSCRIPTION_KEY="3c3272b3446f46398e173f36303d1a77"
ENV COMPUTER_VISION_ENDPOINT="https://slide-url-recog.cognitiveservices.azure.com/"
ENV PORT=8080

COPY package*.json ./

RUN npm install

COPY . .

RUN ls

EXPOSE 8080
CMD [ "node", "." ]