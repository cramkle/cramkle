FROM node:alpine AS build-env
WORKDIR /usr/src/app

COPY . .

RUN yarn
RUN yarn build

FROM node:alpine
WORKDIR /usr/src/app

COPY --from=build-env /usr/src/app .

EXPOSE 3000
CMD ["yarn", "start-prod"]
