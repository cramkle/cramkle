FROM node:14-alpine AS build-env
WORKDIR /cramkle

COPY . .

RUN yarn --frozen-lockfile --silent

RUN yarn build

RUN rm -rf .dist/cache

FROM node:14-alpine
WORKDIR /cramkle

COPY --from=build-env \
  /cramkle/casterly.config.js \
  /cramkle/server.js \
  /cramkle/package.json \
  /cramkle/yarn.lock \
  ./

COPY --from=build-env /cramkle/build/ ./build/

RUN yarn --prod --silent

EXPOSE 3000
CMD ["yarn", "start"]
