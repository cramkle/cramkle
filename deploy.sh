#!/bin/bash

unparsed_version=$(git describe --exact-match)

is_stable=$?

if [[ ! -z "$SENTRY_DSN" ]] && (( is_stable == 0 )); then
  echo "CASTERLY_PUBLIC_SENTRY_DSN=$SENTRY_DSN" >> .env
else
  echo "No SENTRY_DSN or not stable build, skipping Sentry config.."
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

commit_hash=$(git rev-parse --short HEAD)

image_name=$REGISTRY_SERVER/cramkle:$commit_hash

docker build -t $image_name -f $dockerfile .

# If the version isn't a prerelease, we'll push it
# using the latest tag as well
if (( is_stable == 0 )); then
  version=${unparsed_version//v}

  echo "Pushing image as latest version"

  image_versioned=$REGISTRY_SERVER/cramkle:$version
  image_latest=$REGISTRY_SERVER/cramkle:latest

  docker tag $image_name $image_latest

  docker push $image_versioned
  docker push $image_latest
else
  echo "Pushing canary image"

  image_latest=$REGISTRY_SERVER/cramkle:canary

  docker tag $image_name $image_canary

  docker push $image_canary
fi
