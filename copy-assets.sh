#!/bin/bash

mkdir -p ./dist/js/scripts
mkdir -p ./dist/js/popup
mkdir -p ./dist/icons

cp ./{manifest.json,preload.js} ./dist
cp ./js/scripts/* ./dist/js/scripts
cp ./js/popup/* ./dist/js/popup
cp ./icons/* ./dist/icons