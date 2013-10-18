#!/bin/sh
forever stop 0
git fetch --all
git reset --hard origin/master
npm install
browserify resources/script/base.js -o resources/script/main.js
forever start app.js