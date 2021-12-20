# Stage 1
FROM node:16 as build-stage

WORKDIR /front-end
COPY package.json .
RUN npm install --silent
COPY . .

RUN npm run build

# Stage 2
FROM nginx:1.17.0-alpine

COPY --from=build-stage /front-end/build /usr/share/nginx/html
EXPOSE $REACT_DOCKER_PORT

CMD nginx -g 'daemon off;'