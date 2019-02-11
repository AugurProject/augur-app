<p align="center"><img src="https://raw.githubusercontent.com/AugurProject/branding/master/name-horizontal/Augur-Mark-Inline.png" width="500"></p>

<p align="center"><a href="https://github.com/AugurProject/augur-app/releases/latest"><img src="https://img.shields.io/github/downloads/AugurProject/augur-app/total.svg"></a>
<a href="https://github.com/AugurProject/augur-app/graphs/contributors"><img src="https://img.shields.io/github/contributors/AugurProject/augur-app.svg"></a>
<a href="https://github.com/AugurProject/augur-app/blob/master/LICENSE.md"><img src="https://img.shields.io/github/license/AugurProject/augur-app.svg"></a>
<br>
<a href="https://invite.augur.net"><img src="https://img.shields.io/discord/378030344374583298.svg"></a>
<a href="https://github.com/AugurProject/augur-app"><img src="https://img.shields.io/github/languages/top/AugurProject/augur-app.svg"></a>
<a href="https://github.com/AugurProject/augur/issues"><img src="https://img.shields.io/badge/contributions-welcome-orange.svg"></a>
<a href="https://github.com/AugurProject/augur/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"></a></p>

# <p align="center">Augur App<a name="title" ></a></p>

<p align="center">Augur App is a lightweight Electron app that bundles the <a href="https://github.com/AugurProject/augur-ui">Augur UI</a> and <a href="https://github.com/AugurProject/augur-node">Augur Node</a> together and deploys them locally to your machine. The Augur UI is a reference client used to interact with the Augur protocols core smart contracts on the Ethereum blockchain. Augur Node is a locally-run program that scans the Ethereum blockchain for event logs relevant to Augur, stores them in a database, and serves the respective data to the Augur UI.</p>

# <p align="center">Installing Augur App<a name="install" ></a></p>

<p align="center">Download the executable of the <a href="https://github.com/AugurProject/augur-app/releases">latest release</a> for your respective operating system:</p>

<p align="center"><img src="https://img.shields.io/github/release/AugurProject/augur-app.svg"></p>

<p align="center"><a href="https://github.com/AugurProject/augur-app/releases/latest"> <img width="200" src="https://nasacso.s3-us-west-2.amazonaws.com/wp-content/uploads/2017/02/14161110/mac-win-linux.png"> </a></p>


<p align="center"><b>MacOS</b> : <code>mac-Augur-1.8.x.dmg</code></p>

<p align="center"><b>Windows</b> : <code>win-Augur-1.8.x.exe</code></p>

<p align="center"><b>Linux</b> : <code>linux-Augur-1.8.x.AppImage</code> || <code>linux-Augur-1.8.x.deb</code></p>


## Contents
<img src="https://www.augur.net/dist/images/screen--market-cycle-step-3.jpg" width="600" align="right">

1. [Running Augur](#runningaugur)
	1. [Build - From Source](#buildsource)
	2. [Build - Binary](#buildbinary)
	3. [Debian Repository](#debain)
2. [Syncing Augur](#syncingaugur)
    1. [Ethereum Nodes](#ethnodes)
    2. [Augur Warp Sync](#augurwarp)
    3. [Parity Warp Sync](#paritywarp)
3. [Ledger Hardware Wallet](#ledger)
	1. [Local SSL Cert](#ssl)
	2. [Firefox Not Supported](#firefox)
4. [Debugging](#debug)
	1. [Logging](#logging)
	2. [Clear Config File](#config)
	3. [Change UI Port](#uiport)


## Running Augur <a name="runningaugur"></a>

<img align="right" width="275" src="https://i.imgur.com/hHEgdQr.png">

1. Download the executable for your respective operating system, double click to install.
2. Select your configuration: Mainnet, Local, Rinkeby, Ropsten, or Kovan. 
3. Select "Connect", and Augur App will begin to sync Augur Node in the background. 
4. When the sync progress gets to ~100%, the "Open Augur App" button will become clickable.
5. Click it to deploy the UI locally in your browser.
6. Authenticate using [MetaMask](https://metamask.io/), [Edge](https://edge.app/), [Ledger](https://www.ledgerwallet.com/) or [Trezor](https://trezor.io/). 


### Build - From Source: <a name="buildsource"></a>
If you want to run Augur App from source, you will need git and npm installed on your machine. Follow these steps:
```bash
# Clone this repository
git clone https://github.com/AugurProject/augur-app
# Go into the repository
cd augur-app
# Install dependencies
npm install
# Run the app.
npm run dev
```
Once the application is running, wait for the Sync progress to reach 100%, then the "Open Augur UI" button will light up and you can click on it to open the Augur UI. Note that the Augur App must remain open while using the UI, or it will stop functioning.

If the instructions above don't work try:
```
yarn
yarn run dev
```

### Build - Binary: <a name="buildbinary"></a>

    Windows: npm run make-win  
    MacOs: npm run make-mac 
    Linux: npm run make-linux  
    All: npm run make-all

### Debian Repository: <a name="debian"></a>

You may also use `apt` to keep up to date with the latest Augur executable.
Debian 9 ("stretch"), Ubuntu 16.04 ("Xenial Xerus"), and Ubuntu 18.04 ("Bionic Beaver") are supported.

Please download the [augur key](https://repo.augur.net/repo_augur_net.key) and add it to the apt keyring:
```
sudo apt-key add repo_augur_net.key
```

Add the the following to the file `/etc/apt/sources.list.d/augur.list`:
```
deb https://repo.augur.net/ augur stable
```

You may now run the following commands to install augur:
```
sudo apt update
sudo apt install augur
```

## Syncing Augur <a name="syncingaugur"></a>

### Ethereum Nodes: <a name="ethnodes"></a>

Currently, there are two options for connecting to an Ethereum node:

- Run a synced [Geth](https://github.com/ethereum/go-ethereum) or [Parity](https://www.parity.io) client locally. (The quickest way to do this is by starting up a Geth light node by running the following command: `geth --syncmode="light" --rpc --ws --wsorigins='127.0.0.1,http://127.0.0.1:8080,https://127.0.0.1:8080'`). Running Parity in light mode won't work, due to [a bug](https://github.com/paritytech/parity-ethereum/issues/9184).

    or

- Connect to a trusted remote node. By default, the Augur App uses [Alchemy's](https://alchemyapi.io/) public Ethereum node. 

### Augur Warp Sync: <a name="augurwarp"></a>

Within the Augur App UI, there is an option to import a **warp sync** file which contains the synced database needed for Augur to run. You can have a friend who has synced Augur export their warp file, and Augur App will sync almost immediately. 

**WARNING: BE AWARE YOU ARE TRUSTING THE SOURCE WITH YOUR AUGUR STATE. THEY COULD GIVE YOU BAD DATA. YOU MUST ENTIRELY TRUST THE SOURCE OF THE WARP SYNC FILE, AND THERE ARE SIGNIFICANT RISKS WITH USING UNTRUSTED WARP SYNC FILES.**

### Parity Warp Sync: <a name="paritywarp"></a>

By default, Parity uses "warp sync" mode (sometimes referred to as "fast") to sync the blockchain. While this mode does sync significantly faster, it causes issues for any application that relies on historic logs. After warp sync is complete, your node might appear to be sychronized and fully up-to-date, but older blocks are missing while it backfills, which could take several days. It is also not obvious when that backfill has completed.

Augur recommends running your parity nodes with either
- `--no-warp` **or**
- `--warp-barrier 5900000`

If neither of these options are specified, the node could still be functional. See [this parity documentation](https://wiki.parity.io/FAQ#what-does-paritys-command-line-output-mean) for help determining if your Parity node is ready to answer historic requests. [Parity Issue #7411](https://github.com/paritytech/parity-ethereum/issues/7411)

## Ledger Hardware Wallet <a name="ledger"></a>

### Local SSL Cert: <a name="ssl"></a>

Ledger requires SSL, which isn't available by default while running software on localhost. If you plan to use a Ledger hardware wallet with Augur, you must first select **"Enable SSL For Ledger"** before clicking "Open Augur App". Selecting "Enable SSL For Ledger" generates a self-signed SSL certificate locally, allowing you to interact with your Ledger hardware wallet. Other available authentication methods do not require this.

### Firefox Not Supported: <a name="firefox"></a>

Due to the current architecture of this implementation, the use of self-signed SSL certificates, and Firefox's security model, using a Ledger with Firefox is **not currently supported**. We will be working to fix this issue. In the meantime, it is recommended to use Chrome with Ledger.

## Debugging <a name="debug"></a>

###  Logging: <a name="logging"></a>

If you are looking for more information from augur-node and augur-app, checkout the logs. 

**MacOS** : ```~/Library/Logs/augur/log.log```

**Windows** : ```%USERPROFILE%\AppData\Roaming\augur\log.log```

**Linux** : ``` ~/.config/augur/log.log```

Also, in augur-app, there is a menu option to open folder browser for log directory and data directory.

###  Clearing Configuration File: <a name="config"></a>

If you've installed a previous pre-release of Augur App locally on your machine prior to the main Ethereum network deployment, **you will need to clear your local Augur App configuration file in order to properly run this Augur App release and connect to the Ethereum main network.**

Please delete the ```augur``` directory (or, just the ```app.config``` file) in the following location:

**MacOS** : ```~/Library/Application\ Support/augur```

**Windows** : ```%AppData%\augur```

**Linux** : ``` ~/.augur```

### Change Local UI Port: <a name="uiport"></a>

`uiPort` is a new property in config.json (see location above). Change `uiPort` property to whatever port you want. Here is an example of the uiPort property changed:

```
{
  "uiPort": "8181",
  "sslPort": "8443"
        ...
```

### Test Auto-Update: <a name="autoupdate"></a>

1. Run `npm run minio:spin-up` in a separate terminal window.
2. Update version in package.json to a proper x.x.x version (e.g. 1.10.0)
3. Run `npm run make:local && npm run publish:local`
4. Open `http://localhost:9000/minio/augur-app/` to confirm artifacts are shown in the repository. (AWS_ACCESS_KEY_ID=FXX4WBKC65J15KP993DP AWS_SECRET_ACCESS_KEY=xk2VJezDOsR5xlhM9f4osqyTPnLujE0WbHv0h4WY)
5. Decrement version stated in package.json (e.g. 1.9.0)
6. Run `npm run make:local && npm run publish:local`
7. Open the application artifact that now lives in the `dist` folder.

## FAQ & Disclaimer<a name="faq"></a>

It is **highly recommended** that users read the [FAQ](https://augur.net/faq) and [disclaimer](https://augur.net/disclaimer) prior to interacting with the Augur protocol on the main Ethereum network.


## Questions, Bugs and Issues<a name="questions"></a>

Please file any bugs or issues related to Augur App as a GitHub issue in the [Augur App](https://github.com/AugurProject/augur-app) repository. If your issue is related to Augur Node, use the [Augur Node](https://github.com/AugurProject/augur-app) repository. If you have a UI bug or issue to report, use the [Augur UI Client](https://github.com/AugurProject/augur-ui)  repository. 

Alternatively, you can share feedback or seek help from community members in the [Augur Discord](https://discordapp.com/invite/faud6Fx). 

When filing a bug, it may helpful to include the log file generated Augur App:

**MacOS** : ~/Library/Logs/augur/log.log

**Windows** : %USERPROFILE%\AppData\Roaming\augur\log.log

**Linux** : ~/.config/augur/log.log

