FROM node:alpine

ENV BASE_PATH /var/app
WORKDIR $BASE_PATH

RUN apk update && \
    apk upgrade && \
    apk add --update --no-cache \
      git

RUN npm install -g npm@7.5.4

COPY package.json $BASE_PATH/.
COPY package-lock.json $BASE_PATH/.

RUN npm install

CMD ["npx", "nodemon", "src/server/index.js"]
