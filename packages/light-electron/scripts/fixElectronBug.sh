#!/usr/bin/env bash

# There is a bug with __static in Electron when running `yarn electron`
# Apply this patch: https://github.com/electron-userland/electron-webpack/pull/154
find='process.resourcesPath + "\/static"'
replace='"${path.join(configurator.projectDir, "static").replace(\/\\\\\/g, "\\\\\\\\")}"'
sed -i '.bak' "s/$find/$replace/g" ./node_modules/electron-webpack/out/targets/MainTarget.js