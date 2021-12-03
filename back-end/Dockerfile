#what image we want to build from
FROM node:14

# Create app directory
WORKDIR /back-end

# Install app dependencies
COPY package.json .
RUN npm install --silent

# Bundle app source
COPY . .
CMD npm start