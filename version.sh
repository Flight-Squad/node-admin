#!/bin/bash

# https://stackoverflow.com/questions/3474526/stop-on-first-error
set -e

npm run build:clean
git add .
git commit

# Pass all arguments to this script through to `npm version` command
npm version $@

git push --follow-tags
