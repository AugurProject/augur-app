#!/usr/bin/env python3

import os
import requests
import sys
import tarfile
from io import BytesIO
from shutil import copyfile, rmtree
from zipfile import ZipFile


def latest_release():
    # https://api.github.com/repos/ethereum/go-ethereum/releases/latest
    req = requests.get('https://api.github.com/repos/ethereum/go-ethereum/releases/latest')
    results = req.json()
    return results['tag_name']


def geth_sha(tag, length=8):
    req = requests.get('https://api.github.com/repos/ethereum/go-ethereum/git/refs/tags/{}'.format(tag))
    response = req.json()
    sha = response['object']['sha']
    return sha[:length]


tag = latest_release()
sha = geth_sha(tag)

# remove v char if exists
tag = tag.replace('v', '')

#windows_file = 'geth-windows-amd64-{tag}-{sha}.zip'.format(tag=tag, sha=sha)
#mac_file = 'geth-darwin-amd64-{tag}-{sha}.tar.gz'.format(tag=tag, sha=sha)
#gethstore_downloads = {
#        win: {
#
#gethstore_urls = [
#        'https://gethstore.blob.core.windows.net/builds/{}'.format(windows_file),
#        'https://gethstore.blob.core.windows.net/builds/{}'.format(mac_file),
#        ]

#for url in gethstore_urls:
#    print(url)

# get windows build
win_url = 'https://gethstore.blob.core.windows.net/builds/geth-windows-amd64-{tag}-{sha}.zip'.format(tag=tag, sha=sha)
print(win_url)
response = requests.get(win_url)

zipfile = ZipFile(BytesIO(response.content))
for file in zipfile.namelist():
    if 'exe' in file:
        zipfile.extract(file)
        #copyfile(file, 'resources/win/geth.exe')
        os.rename(file, 'resources/win/geth.exe')
        windir = file.split('/')[0]
        rmtree(windir)

# download OSX client
#osx_url = 'https://gethstore.blob.core.windows.net/builds/geth-darwin-amd64-{tag}-{sha}.zip'.format(tag=tag,sha=sha)


osx_url = 'https://gethstore.blob.core.windows.net/builds/geth-darwin-amd64-{tag}-{sha}.tar.gz'.format(tag=tag, sha=sha)
geth_osx_file = 'geth-darwin-amd64-{tag}-{sha}.tar.gz'.format(tag=tag, sha=sha)
geth_osx_dir = geth_osx_file.replace('.tar.gz', '')
print(osx_url)
try:
    response = requests.get(osx_url,
                            stream=True,
                            )
    response.raise_for_status()
    with open(geth_osx_file, 'wb') as f:
        for chunk in response.iter_content(chunk_size=1024):
            if chunk:
                f.write(chunk)
                f.flush()
except requests.exceptions.RequestException as err:
    print("Oops: Something went wrong: ", err)
    sys.exit(1)
except requests.exceptions.HTTPError as errh:
    print("Http Error: ", errh)
    sys.exit(1)
except requests.exceptions.ConnectionError as errc:
    print("Error Connecting: ", errc)
    sys.exit(1)
except requests.exceptions.Timeout as errt:
    print("Timeout Error: ", errt)
    sys.exit(1)


tar = tarfile.open(geth_osx_file, "r:gz")
tar.extractall()
tar.close()
os.rename('{}/geth'.format(geth_osx_dir), 'resources/mac/geth')
rmtree(geth_osx_dir)
os.unlink(geth_osx_file)





geth_linux_file = 'geth-linux-amd64-{tag}-{sha}.tar.gz'.format(tag=tag, sha=sha)
linux_url = 'https://gethstore.blob.core.windows.net/builds/{}'.format(geth_linux_file)
geth_linux_dir = geth_linux_file.replace('.tar.gz', '')
print(linux_url)
try:
    response = requests.get(linux_url,
                            stream=True,
                            )
    response.raise_for_status()
    with open(geth_linux_file, 'wb') as f:
        for chunk in response.iter_content(chunk_size=1024):
            if chunk:
                f.write(chunk)
                f.flush()
except requests.exceptions.RequestException as err:
    print("Oops: Something went wrong: ", err)
    sys.exit(1)
except requests.exceptions.HTTPError as errh:
    print("Http Error: ", errh)
    sys.exit(1)
except requests.exceptions.ConnectionError as errc:
    print("Error Connecting: ", errc)
    sys.exit(1)
except requests.exceptions.Timeout as errt:
    print("Timeout Error: ", errt)
    sys.exit(1)

tar = tarfile.open(geth_linux_file, "r:gz")
tar.extractall()
tar.close()
os.rename('{}/geth'.format(geth_linux_dir), 'resources/linux/geth')
rmtree(geth_linux_dir)
os.unlink(geth_linux_file)

# print(zipfile.namelist())


# 
# :! scripts/update-geth.py
# https://gethstore.blob.core.windows.net/builds/geth-windows-amd64-1.8.23-c9427004.zip
# ['geth-windows-amd64-1.8.23-c9427004/COPYING', 'geth-windows-amd64-1.8.23-c9427004/geth.exe']

# OSX
# https://gethstore.blob.core.windows.net/builds/geth-darwin-amd64-1.8.23-c9427004.tar.gz
