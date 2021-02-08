FROM node:alpine

ENV BASE_PATH /var/app
WORKDIR $BASE_PATH

RUN apk update && \
    apk upgrade && \
    apk add --update --no-cache \
      git

RUN npm install -g npm@7.5.1
RUN npm install

CMD ["npx", "http-server", "$BASE_PATH/src"]
