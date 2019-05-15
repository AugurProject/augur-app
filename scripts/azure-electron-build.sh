#!/bin/bash
set -euo pipefail

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
    which node
    which npx
    find . -name electron-builder
    export npm_config_build_from_source=false
    npm install
    find node_modules/augur-ui/build  | xargs touch
    export NODE_ENV=production
    npm run make-win -- --publish $ELECTRON_PUBLISH
elif [[ $AGENT_OS == 'Darwin' ]]; then
    echo 'Mac'
    npm install
    find node_modules/augur-ui/build  | xargs touch
    npm run compile
    NODE_ENV=production npx electron-builder --mac --publish $ELECTRON_PUBLISH
elif [[ $AGENT_OS == 'Linux' ]]; then
    echo 'Linux'
    npm install
    find node_modules/augur-ui/build  | xargs touch
    npm run compile
    NODE_ENV=production npx electron-builder --linux --publish $ELECTRON_PUBLISH
else
    echo 'unknown OS'
    exit 255
fi

if [[ $ELECTRON_PUBLISH == 'always' ]]; then
    if [[ $AGENT_OS == 'Windows_NT' ]]; then
        python ./scripts/post_build.py
    else
        python scripts/post_build.py
    fi
    cat dist/*.sha256
else
    echo 'Not generating sha256 files'
fi

#    npm install --quiet
#    NODE_ENV=production npm run make-linux
