# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# yarn lockfile
COPY yarn.lock ./

RUN yarn install

# Bundle app source
COPY . ./

RUN yarn remove bcrypt

# install the bcrypt modules for the machine
RUN yarn add bcrypt