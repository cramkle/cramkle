FROM node:14-alpine AS build-env
WORKDIR /cramkle

COPY . .

RUN yarn --frozen-lockfile

RUN yarn build

RUN rm -rf .dist/cache

FROM node:14-alpine
WORKDIR /cramkle

COPY --from=build-env /cramkle .

RUN yarn --prod

EXPOSE 3000
CMD ["yarn", "start"]
