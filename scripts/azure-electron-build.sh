#!/bin/bash
set -euxo pipefail

env

which python
which python3
which pip
which pip3
python --version

pip install requests
pip3 install requests

python -c 'import requests'

if [[ $AGENT_OS == 'Windows_NT' ]]; then
    echo 'Windows'
elif [[ $AGENT_OS == 'Darwin' ]]; then
    echo 'Mac'
elif [[ $AGENT_OS == 'Linux' ]]; then
    echo 'Linux'
else
    echo 'unknown OS'
    exit 255
fi
