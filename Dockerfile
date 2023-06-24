FROM node:alpine

RUN apk update && apk add python make g++

WORKDIR /app/src/app

COPY package*.json .

COPY . .

RUN npm install

RUN npm run build

CMD ["npm", "start"]