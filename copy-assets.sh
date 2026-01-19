#!/bin/bash

mkdir -p ./dist/transpiled/scripts
mkdir -p ./dist/html
mkdir -p ./dist/icons

cp ./{manifest.json,preload.js} ./dist
cp ./transpiled/scripts/* ./dist/transpiled/scripts
cp ./transpiled/html/* ./dist/transpiled/html
cp ./icons/* ./dist/icons