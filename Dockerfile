FROM node:11 AS build-env

WORKDIR /usr/src/app

COPY . .

RUN yarn
RUN yarn build

FROM node:11-alpine

WORKDIR /usr/src/app

COPY --from=build-env /usr/src/app/ .

RUN yarn --prod

EXPOSE 5000
CMD ["yarn", "serve"]
