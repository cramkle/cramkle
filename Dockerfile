FROM node:12-alpine AS build-env
WORKDIR /cramkle

COPY . .

RUN yarn --frozen-lockfile

RUN yarn workspace @cramkle/app-server build

# TODO: find a way around installing twice
RUN rm -rf packages/app/node_modules
RUN yarn --frozen-lockfile

RUN yarn workspace @cramkle/app build

FROM node:12-alpine
WORKDIR /cramkle

COPY --from=build-env /cramkle .

RUN yarn --prod

EXPOSE 3000
CMD ["yarn", "workspace", "@cramkle/app", "start"]
