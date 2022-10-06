FROM node:16.13.2-alpine AS production

WORKDIR ./opt/app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build
