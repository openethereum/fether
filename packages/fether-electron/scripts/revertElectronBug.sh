#!/usr/bin/env bash

# This is the revert patch from ./fixElectronBug.sh
PWD="$(pwd)"
# Note: This may return `/usr/local/bin/sed /usr/bin/sed` if both macOS Sed and GNU Sed are installed.
SED_MAC_DIR="$(which -a sed)"
FIND='"${path.join(configurator.projectDir, "static").replace(\/\\\\\/g, "\\\\\\\\")}"'
REPLACE='process.resourcesPath + "\/static"'
# Note: This must be run from the Fether project root directory
FILE="${PWD}/node_modules/electron-webpack/out/targets/MainTarget.js"
case "$OSTYPE" in
  darwin*)
    # Refer to comments in ./fixElectronBug.sh
    if [[ $SED_MAC_DIR == *"/usr/bin/sed"* ]] ;
    then
      /usr/bin/sed -i '.bak' "s/$FIND/$REPLACE/g" $FILE
    else
      echo 'Error: macOS Sed not found'
    fi
    ;;
  *) sed -i "s/$FIND/$REPLACE/g" $FILE
esac
