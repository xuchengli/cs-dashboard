FROM node:9-alpine
MAINTAINER li xu cheng "lixucheng@aliyun.com"

RUN apk update && apk add ffmpeg && rm -rf /var/cache/apk/*

# Build and start up app
RUN mkdir -p /usr/app/src
COPY . /usr/app/src
WORKDIR /usr/app/src
RUN npm install && npm cache clean --force
EXPOSE 8080
CMD ["npm", "start"]
