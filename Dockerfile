FROM node:22.2.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --force

COPY . .
RUN npm run build

EXPOSE 3100

CMD ["npm", "run", "start"]
