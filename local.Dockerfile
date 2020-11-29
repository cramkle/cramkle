FROM node:14-alpine AS build-env
WORKDIR /cramkle

COPY . .

RUN yarn build

RUN rm -rf build/cache

EXPOSE 3000
CMD ["yarn", "start"]
