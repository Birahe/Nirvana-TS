FROM node:alpine

WORKDIR /app/src/app

COPY package*.json .

COPY . .

RUN npm install

RUN npm run build

CMD ["npm", "start"]