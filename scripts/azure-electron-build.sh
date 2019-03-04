#!/bin/bash
set -euxo pipefail

env

python --version

pip install requests

python -c 'import requests'

if [[ $AGENT_OS == 'Windows_NT' ]]; then
    echo 'Windows'
    npm run compile && electron-builder --win
elif [[ $AGENT_OS == 'Darwin' ]]; then
    echo 'Mac'
    npm run compile && electron-builder --mac
elif [[ $AGENT_OS == 'Linux' ]]; then
    echo 'Linux'
    npm run compile && electron-builder --linux
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
