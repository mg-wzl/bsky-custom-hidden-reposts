#!/bin/bash

mkdir -p ./dist/transpiled/scripts
mkdir -p ./dist/html
mkdir -p ./dist/icons

cp ./{manifest.json,preload.js} ./dist
cp ./transpiled/scripts/* ./dist/transpiled/scripts
cp ./html/* ./dist/html
cp ./icons/* ./dist/icons