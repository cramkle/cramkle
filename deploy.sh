#!/bin/bash

version=$(git describe --exact-match)

if [[ ! $? -eq 0 ]]; then
  echo "Nothing to publish, exiting.."
  exit 0;
fi

if [[ ! -z "$SENTRY_DSN" ]]; then
  echo "REACT_APP_SENTRY_DSN=$SENTRY_DSN" >> .env
fi

if [[ -z "$REGISTRY_SERVER" ]]; then
  echo "No registry server, exiting.."
  exit 0;
fi

image_name=$REGISTRY_SERVER/cramkle/cramkle:$version
image_latest=$REGISTRY_SERVER/cramkle/cramkle:latest

docker build -t $image_name .
docker tag $image_name $image_latest
docker push $image_name
docker push $image_latest
