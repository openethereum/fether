#!/bin/bash
# ISC, Copyright 2017 Jaco Greeff

set -e

echo "Running code checks & build"

npm run lint
npm run build
npm run test

exit 0
