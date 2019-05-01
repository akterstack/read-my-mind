FROM node:10.15.0-alpine

WORKDIR /home/app

COPY package*.json ./
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
    && npm install \
    && apk del .gyp

COPY . ./

EXPOSE 4000
