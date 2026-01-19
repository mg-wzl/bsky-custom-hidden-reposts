#!/bin/bash

mkdir -p ./dist
cp ./{manifest.json,preload.js} ./dist
cp -r ./js ./dist/js
cp -r ./icons ./dist/icons