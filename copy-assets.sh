#!/bin/bash

mkdir -p ./dist/js/scripts
mkdir -p ./dist/js/html
mkdir -p ./dist/icons

cp ./{manifest.json,preload.js} ./dist
cp ./js/scripts/* ./dist/js/scripts
cp ./js/html/* ./dist/js/html
cp ./icons/* ./dist/icons