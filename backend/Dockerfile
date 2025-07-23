FROM node:18-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 5000

CMD ["npm", "start"]