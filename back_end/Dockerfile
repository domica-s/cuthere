# This is the docker file to run the backend script for production 
# Programmer: Ethan Lee
# This code is called when the user runs the script to use docker to set up the environment
FROM node:alpine3.11

RUN mkdir -p /app
WORKDIR /app/

COPY ./package*.json /app/

RUN npm install

COPY . /app/
