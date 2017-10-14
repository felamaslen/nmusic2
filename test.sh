#!/bin/bash

mocha="./node_modules/.bin/mocha"

$mocha test/api/**/*.spec.js
$mocha test/scripts/**/*.spec.js
$mocha --require babel-core/register test/src/**/*.spec.js

exit 0

