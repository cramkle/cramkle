FROM node:12-alpine AS build-env
WORKDIR /cramkle

COPY . .

RUN yarn --frozen-lockfile

RUN yarn workspace @cramkle/app-server build
RUN yarn workspace @cramkle/app build

FROM node:12-alpine
WORKDIR /cramkle

COPY --from=build-env /cramkle .

RUN yarn --prod

EXPOSE 3000
CMD ["yarn", "workspace", "@cramkle/app", "start"]
