#!/bin/bash

sizes=(36 48 57 60 72 76 96 114 120 144 152 180 192 512)

apple_sizes=(57 60 72 76 114 120 144 152 180)
favicon_sizes=(16 32 64)
android_sizes=(36 48 72 96 144 192 512)

if ! which svgexport &> /dev/null; then
  echo "svgexport is not installed. You can install it by running \"yarn global add svgexport\""
  exit 1
fi

if ! which convert &> /dev/null; then
  echo "ImageMagick is not installed. Follow the instructions for your operating system to install it."
  exit 1
fi

for size in "${sizes[@]}"; do
  svgexport ./src/assets/logo-square.svg "./public/icons/icon-${size}x$size.png" $size:$size
done

for size in "${favicon_sizes[@]}"; do
  svgexport ./src/assets/logo-white.svg "./public/icons/favicon-${size}x$size.png" $size:$size
done

for size in "${apple_sizes[@]}"; do
  cp "./public/icons/icon-${size}x$size.png" "./public/icons/apple-icon-${size}x$size.png"
done

for size in "${android_sizes[@]}"; do
  cp "./public/icons/icon-${size}x$size.png" "./public/icons/android-icon-${size}x$size.png"
done

convert -background transparent ./public/icons/favicon-64x64.png -define icon:auto-resize=16,32,64 ./public/icons/favicon.ico

for size in "${sizes[@]}"; do
  rm "./public/icons/icon-${size}x$size.png"
done
