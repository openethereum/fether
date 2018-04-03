#!/bin/bash
# ISC, Copyright 2017 Jaco Greeff

set -e

echo "Running code checks & build"

npm run lint
npm run build
npm run test:coverage

# Pull requests and commits to other branches shouldn't try to deploy, just build to verify
if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "master" ]; then
  echo "Branch check completed"

  exit 0
fi

echo "Setting up GitHub config"

git config push.default simple
git config merge.ours.driver true
git config user.name "Travis CI"
git config user.email "$COMMIT_AUTHOR_EMAIL"
git remote set-url origin https://${GH_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git > /dev/null 2>&1

if [ -n "$(git status --untracked-files=no --porcelain)" ]; then
  echo "Adding build artifacts"

  git add .
  git commit -m "[CI Skip] Build artifacts"
fi

echo "Publishing to npm"

npm run ci:makeshift
npm --no-git-tag-version version
npm version patch -m "[CI Skip] %s"
npm publish

echo "Final push to GitHub"

git push --quiet origin HEAD:refs/heads/$TRAVIS_BRANCH > /dev/null 2>&1

echo "Release completed"

exit 0
