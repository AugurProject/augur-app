#!/bin/bash
set -euxo pipefail

env

python --version

pip install requests

python -c 'import requests'

export NODE_ENV=production
npm install --silent
npm run compile

if [[ $AGENT_OS == 'Windows_NT' ]]; then
    echo 'Windows'
    electron-builder --win
elif [[ $AGENT_OS == 'Darwin' ]]; then
    echo 'Mac'
    electron-builder --mac
elif [[ $AGENT_OS == 'Linux' ]]; then
    echo 'Linux'
    electron-builder --linux
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
