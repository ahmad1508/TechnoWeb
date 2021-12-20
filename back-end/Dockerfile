FROM node:16

WORKDIR /back-end
COPY package.json .
RUN npm install --silent
COPY . .
CMD npm start