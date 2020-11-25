#!/bin/bash

unparsed_version=$(git describe --exact-match)

if [[ ! $? -eq 0 ]]; then
  echo "Nothing to publish, exiting.."
  exit 0;
fi

version=${unparsed_version//v}

if [[ ! -z "$SENTRY_DSN" ]]; then
  echo "REACT_APP_SENTRY_DSN=$SENTRY_DSN" >> .env
else
  echo "No SENTRY_DSN, skipping Sentry config.."
fi

if [[ -z "$REGISTRY_SERVER" ]]; then
  echo "No registry server, exiting.."
  exit 0;
fi

image_name=$REGISTRY_SERVER/cramkle/cramkle:$version
image_latest=$REGISTRY_SERVER/cramkle/cramkle:latest

docker build -t $image_name .

echo "Pushing version $version"

docker push $image_name

# If the version isn't a prerelease, we'll push it
# using the latest tag as well
if [[ ! $version =~ - ]]; then
  echo "Pushing image as latest version"

  docker tag $image_name $image_latest
  docker push $image_latest
fi
