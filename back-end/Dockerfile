FROM node:14

WORKDIR /back-end
COPY package.json .
RUN npm install --silent
COPY . .
CMD npm start