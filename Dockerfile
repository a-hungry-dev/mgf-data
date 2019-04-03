FROM node:latest

EXPOSE 80

WORKDIR /usr/src/app

COPY node_app/ ./

RUN npm install

CMD [ "npm", "start" ]
