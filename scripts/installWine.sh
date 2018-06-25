#!/bin/sh

# Install wine on Linux to build Windows binaries
if [ "$TRAVIS_OS_NAME" = "linux" ]; then
  sudo apt-get update
  sudo apt-get install -y wine-stable
fi
