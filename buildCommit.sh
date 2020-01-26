#!/bin/bash

# https://stackoverflow.com/questions/3474526/stop-on-first-error
set -e

npm run build
git add .
git commit
