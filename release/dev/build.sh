#!/usr/bin/env bash
cd `dirname $0`
cd ..
cd ..
basepath=$(pwd)
node release/index.js -f ${basepath}/release/dev/config.js --path /JWYWEB/dist/dev/ --dist ${basepath}/dist/dev/
