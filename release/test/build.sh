#!/usr/bin/env bash
cd `dirname $0`
cd ..
cd ..
basepath=$(pwd)
node release/index.js -f ${basepath}/release/test/config.js --path /JWYWEB/dist/test/ --dist ${basepath}/dist/test/
