#!/bin/bash
npm run build
git add .
git commit
npm version patch
git push --follow-tags
