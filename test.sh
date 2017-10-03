#!/bin/bash

mocha="./node_modules/.bin/mocha"

$mocha test/api/**/*.spec.js
$mocha test/src/index.js
$mocha test/scripts/**/*.spec.js

exit 0

