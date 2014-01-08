#!/bin/sh
browserify resources/script/base.js lib/client/canny.js -o fe/js/min/fe.js

node app.js

