#!/usr/bin/env bash

# This is the revert patch from ./fixElectronBug.sh
FIND='"${path.join(configurator.projectDir, "static").replace(\/\\\\\/g, "\\\\\\\\")}"'
REPLACE='process.resourcesPath + "\/static"'
FILE='./node_modules/electron-webpack/out/targets/MainTarget.js'
case "$OSTYPE" in
  darwin*)  sed -i '.bak' "s/$FIND/$REPLACE/g" $FILE ;; 
  *)        sed -i "s/$FIND/$REPLACE/g" $FILE ;;
esac
