#!/bin/bash

if [[ ! -z "$SENTRY_DSN" ]]; then
  echo "REACT_APP_SENTRY_DSN=$SENTRY_DSN" >> .env
fi

image_name=$REGISTRY_SERVER/cramkle/cramkle:$VERSION 
image_latest=$REGISTRY_SERVER/cramkle/cramkle:latest

docker build -t $image_name .
docker tag $image_name $image_latest
docker push $image_name
docker push $image_latest
