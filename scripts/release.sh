#!/bin/sh

if [ "$TRAVIS_OS_NAME" = "linux" ]; then
  yarn release --win --linux
else
  yarn release --macos
fi
