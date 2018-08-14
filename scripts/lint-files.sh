#!/bin/sh

# Lint (format in-place) files passed as args w/ Prettier and then semistandard

[ $# -eq 0 ] && exit 0; # Exit successfully if no arguments

echo 'Linting...'

prettier --write --ignore-path .gitignore --loglevel error $@ &&
semistandard $@ --fix --parser babel-eslint