#!/usr/bin/env bash

# There is a bug with __static in Electron when running `yarn electron`
# Apply this patch: https://github.com/electron-userland/electron-webpack/pull/154
# It's basically a find/replace in a file
FIND='process.resourcesPath + "\/static"'
REPLACE='"${path.join(configurator.projectDir, "static").replace(\/\\\\\/g, "\\\\\\\\")}"'
FILE='./node_modules/electron-webpack/out/targets/MainTarget.js'
case "$OSTYPE" in
  darwin*)  sed -i '.bak' "s/$FIND/$REPLACE/g" $FILE ;; 
  *)        sed -i "s/$FIND/$REPLACE/g" $FILE ;;
esac
