#!/bin/bash
set -euo pipefail

env

python --version

pip install requests

python -c 'import requests'

npm install
npm run compile

export NODE_ENV=production

if [[ $AGENT_OS == 'Windows_NT' ]]; then
    echo 'Windows'
    npm run make-win
elif [[ $AGENT_OS == 'Darwin' ]]; then
    echo 'Mac'
    npm run make-mac
elif [[ $AGENT_OS == 'Linux' ]]; then
    echo 'Linux'
    npm run make-linux
else
    echo 'unknown OS'
    exit 255
fi

if [[ $BUILD_REASON == 'PullRequest' ]]; then
    echo 'Pull Request'
else
    python scripts/post_build.py
    cat dist/*.sha256
fi

    npm install --quiet
    NODE_ENV=production npm run make-linux
