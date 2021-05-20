#!/bin/bash

unparsed_version=$(git describe --exact-match)

if [[ ! $? -eq 0 ]]; then
  echo "Nothing to publish, exiting.."
  exit 0;
fi

version=${unparsed_version//v}

[[ ! $version =~ - ]]
is_stable=$?

if [[ ! -z "$SENTRY_DSN" ]] && (( is_stable == 0 )); then
  echo "CASTERLY_PUBLIC_SENTRY_DSN=$SENTRY_DSN" >> .env
else
  echo "No SENTRY_DSN, skipping Sentry config.."
fi

if [[ -z "$REGISTRY_SERVER" ]]; then
  echo "No registry server, exiting.."
  exit 0;
fi

dockerfile=Dockerfile

while [[ "$#" -gt 0 ]]; do
  case $1 in
    -l|--local) dockerfile=local.Dockerfile; shift ;;
    *) echo "Unknown parameter passed: $1"; exit 1 ;;
  esac
  shift
done

image_name=$REGISTRY_SERVER/cramkle:$version
image_latest=$REGISTRY_SERVER/cramkle:latest

docker build -t $image_name -f $dockerfile .

echo "Pushing version $version"

docker push $image_name

# If the version isn't a prerelease, we'll push it
# using the latest tag as well
if (( is_stable == 0 )); then
  echo "Pushing image as latest version"

  docker tag $image_name $image_latest
  docker push $image_latest
fi
