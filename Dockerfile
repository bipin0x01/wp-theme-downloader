# pulls node docker image and creates an instance of a container
FROM node:12.19.0-alpine3.9 AS development

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy the package json files from the host to the working directory of container
COPY package*.json ./


RUN npm install glob rimraf

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:12.19.0-alpine3.9 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]