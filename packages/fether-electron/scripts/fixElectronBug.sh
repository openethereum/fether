#!/usr/bin/env bash

# There is a bug with __static in Electron when running `yarn electron`
# Apply this patch: https://github.com/electron-userland/electron-webpack/pull/154
# It's basically a find/replace in a file
PWD="$(pwd)"
# Note: This may return `/usr/local/bin/sed /usr/bin/sed` if both macOS Sed and GNU Sed are installed.
SED_MAC_DIR="$(which -a sed)"
FIND='process.resourcesPath + "\/static"'
REPLACE='"${path.join(configurator.projectDir, "static").replace(\/\\\\\/g, "\\\\\\\\")}"'
# Note: This must be run from the Fether project root directory
FILE="${PWD}/node_modules/electron-webpack/out/targets/MainTarget.js"
case "$OSTYPE" in
  darwin*)
    # Run explicit macOS in-built Sed command (i.e. `/usr/bin/sed` instead of just `sed`) since it is supported.
    # Note: On macOS it is necessary to run the Sed command explicitly because the `sed` command may not be in the 
    # users PATH, or the `sed` binary may actually have been configured to run GNU Sed (not supported) instead.
    # of the macOS in-built Sed (supported).
    #
    # For example, instead of a user installing GNU Sed with `brew install gnu-sed` (which allows GNU Sed
    # binary to be run with `/usr/local/bin/gsed`), they may have installed it with 
    # `brew install --with-default-names gnu-sed` (which allows the GNU Sed binary to be run with `sed` or 
    # `/usr/local/bin/sed`), so running just `sed` would run GNU Sed instead of macOS in-built Sed.
    if [[ $SED_MAC_DIR == *"/usr/bin/sed"* ]] ;
    then
      /usr/bin/sed -i '.bak' "s/$FIND/$REPLACE/g" $FILE
    else
      echo 'Error: macOS Sed not found'
    fi
    ;;
  *) sed -i "s/$FIND/$REPLACE/g" $FILE
esac
