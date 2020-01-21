#!/bin/bash

# https://stackoverflow.com/questions/3474526/stop-on-first-error
set -e

npm run build:clean
git add .
git commit
npm version patch
git push --follow-tags
