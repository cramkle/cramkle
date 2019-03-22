FROM node:11-alpine AS build-env
WORKDIR /usr/src/app

COPY . .

RUN yarn --frozen-lockfile
RUN yarn build

FROM node:11-alpine
WORKDIR /usr/src/app

COPY --from=build-env /usr/src/app .

RUN yarn --prod

EXPOSE 3000
CMD ["yarn", "start-prod"]
