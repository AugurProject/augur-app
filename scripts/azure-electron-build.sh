#!/bin/bash
set -euo pipefail

env

python --version

pip install requests

python -c 'import requests'

case $BUILD_SOURCEBRANCH in
    *master|*release*)
        ELECTRON_PUBLISH=always
        ;;
    *)
        ELECTRON_PUBLISH=never
        ;;
esac

if [[ $AGENT_OS == 'Windows_NT' ]]; then
    echo 'Windows'
    export npm_config_build_from_source=false
    export NODE_ENV=production
    yarn
    yarn compile
    yarn electron-builder --win --publish $ELECTRON_PUBLISH
    pip install requests
    python scripts\post_build.py
elif [[ $AGENT_OS == 'Darwin' ]]; then
    echo 'Mac'
    npm install
    npm run compile
    NODE_ENV=production npx electron-builder --mac --publish $ELECTRON_PUBLISH
elif [[ $AGENT_OS == 'Linux' ]]; then
    echo 'Linux'
    npm install
    npm run compile
    NODE_ENV=production npx electron-builder --linux --publish $ELECTRON_PUBLISH
else
    echo 'unknown OS'
    exit 255
fi

if [[ $ELECTRON_PUBLISH == 'always' ]]; then
    python scripts/post_build.py
    cat dist/*.sha256
else
    echo 'Not generating sha256 files'
fi

#    npm install --quiet
#    NODE_ENV=production npm run make-linux
