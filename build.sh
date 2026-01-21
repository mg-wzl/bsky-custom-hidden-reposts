#!/bin/bash

# collect compiled chrome extension files
rm -rf dist
mkdir -p ./dist
cp ./{manifest.json,preload.js} ./dist
cp -r ./js ./dist/js
cp -r ./icons ./dist/icons

# create downloadable chrome extension archive
rm -f ./download/bsky-custom-hidden-reposts.zip
zip -r ./download/bsky-custom-hidden-reposts.zip ./dist/*