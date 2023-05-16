FROM node:14-alpine AS build-env
WORKDIR /cramkle

COPY . .

RUN npm install --legacy-peer-deps

RUN npm run build

RUN rm -rf build/cache

FROM node:14-alpine
WORKDIR /cramkle

COPY --from=build-env \
  /cramkle/next.config.js \
  /cramkle/package.json \
  /cramkle/package-lock.json \
  ./

COPY --from=build-env /cramkle/.next .next

RUN npm install --legacy-peer-deps

EXPOSE 3000
CMD ["npm", "start"]
