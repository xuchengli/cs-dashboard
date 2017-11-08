FROM node:9-alpine
MAINTAINER li xu cheng "lixucheng@aliyun.com"

RUN apk update && apk add ffmpeg && rm -rf /var/cache/apk/*

ARG app_env
ENV NODE_ENV $app_env

RUN mkdir -p /usr/app/src
WORKDIR /usr/app/src
COPY ./ ./

RUN npm install && npm cache clean --force

CMD if [ ${NODE_ENV} = "production" ]; then \
        npm start; \
    else \
        npm run dev; \
    fi

EXPOSE 8080
