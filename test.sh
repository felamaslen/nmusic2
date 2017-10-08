#!/bin/bash

mocha="./node_modules/.bin/mocha"

$mocha test/api/**/*.spec.js
$mocha test/src/index.js

exit 0

