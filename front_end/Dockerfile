FROM node:alpine3.11

RUN mkdir -p /app
WORKDIR /app/

COPY ./package*.json /app/

RUN npm install

COPY . /app/

ENV PROXY_API=$PROXY_API

RUN npm run build
