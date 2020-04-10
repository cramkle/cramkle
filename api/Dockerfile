FROM node:12-alpine AS build-env

WORKDIR /usr/src/app

## Install build toolchain, install node deps and compile native add-ons
RUN apk add --no-cache --virtual .gyp python make g++

COPY . .

RUN yarn --frozen-lockfile

RUN yarn workspace @cramkle/api build

FROM node:12-alpine

WORKDIR /usr/src/app

COPY --from=build-env /usr/src/app/ .

RUN yarn --prod

EXPOSE 5000
CMD ["yarn", "start"]
