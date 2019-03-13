![Parity Fether](https://wiki.parity.io/images/logo-parity-fether.jpg)

# Parity Fether - a decentralised, light client-based wallet

## [» Download the latest release «](https://github.com/paritytech/fether/releases)


---

## About Parity Fether

Parity Fether aims to be the lightest and simplest decentralized wallet. It supports Ether and ERC-20 tokens, and runs on top of [Parity Ethereum](https://github.com/paritytech/parity-ethereum) light client. This allows smooth synchronization and interaction with the Ethereum blockchain, in a decentralized manner.

By default, Parity Fether alpha runs on the Kovan test network. You can receive free Kovan Ether by posting your address in the [Kovan Faucet](https://gitter.im/kovan-testnet/faucet) Gitter channel. Fether will download and launch Parity Ethereum node at startup if it's not found on the computer. You can also separately launch your Ethereum client, Fether will automatically connect to it.

Parity Fether connects to the light node using [`@parity/light.js`](https://github.com/paritytech/js-libs/tree/master/packages/light.js), a Javascript library specifically crafted for wallets to connect with light clients. 

Parity Fether is licensed under the BSD 3-Clause, and can be used for all your Ethereum needs.

If you run into problems while using Parity Fether, feel free to file an issue in this repository or hop on our [Gitter](https://gitter.im/paritytech/fether) or [Riot](https://riot.im/app/#/group/+parity:matrix.parity.io) chat room to ask a question. We are glad to help! **For security-critical issues**, please refer to the security policy outlined in [SECURITY.md](https://github.com/paritytech/parity/blob/master/SECURITY.md).

---

## Screenshots

![Parity Fether](https://wiki.parity.io/images/fether-screenshot-0.jpg)


## Join the chat!

Get in touch with us on Gitter:
[![Gitter](https://img.shields.io/badge/Gitter-Fether-brightgreen.svg)](https://gitter.im/paritytech/fether)

Official website: https://parity.io | Be sure to check out [our Wiki](https://wiki.parity.io) for more information.

## Install and start Parity Fether

### Mac
- Download the [`.dmg` file](https://github.com/paritytech/fether/releases).
- Double click on it to install Fether.

### Windows
- Download the [`.exe` file](https://github.com/paritytech/fether/releases).
- Double click on it to install Fether.
- Fether will be added to the program menu.

### Linux

  #### Using the AppImage (any distro)
  - Download the [`.AppImage` file](https://github.com/paritytech/fether/releases).
  - Make it executable `chmod +x /path/to/fether-x.x.x-x86_64.AppImage`.
  - Launch it `/path/to/fether-x.x.x-x86_64.AppImage`.
  
  #### Using the binary (any distro)
  - Download the [`.tar.xz` file](https://github.com/paritytech/fether/releases).
  - Unarchive it `tar xf fether-x.x.x.tar.xz`.
  - Launch it `./fether-x.x.x/fether`.
  
  #### Debian installer (Ubuntu, Linux Mint..)
  - Download the [`.deb` file](https://github.com/paritytech/fether/releases).
  - Double click on the file to install Fether.
  - Fether will be added to the program menu.
  


### Passing config flags to the underlying Parity Ethereum node

You can pass specific flags for fether to launch the underlying Parity Ethereum with:

```bash
# Launching Parity Ethereum light client on Ropsten instead of Kovan (default) and connect Fether to it
$ /path/to/fether --chain ropsten --light
```

### Separately launch Parity Ethereum node

You can also launch Parity Ethereum node before, with any flag you want:

```bash
# Launching Parity Ethereum light client on Ropsten instead of Kovan (default)
$ parity --chain ropsten --light
```

In another console launch Fether:

```bash
# Fether will connect to the running node
$ /path/to/fether
```

## Build from sources

### Install dependencies

#### Mac

Install Xcode Command Line Tools, NVM, Node.js latest LTS, Yarn, and Git

```bash
xcode-select --install;
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash;
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
echo -e "Installing Node.js latest LTS version";
nvm install --lts
echo -e "Switching to use Node.js latest LTS version";
nvm use --lts;
brew install yarn --without-node;
brew install git --verbose;
brew upgrade git --verbose;
```

#### Linux and Windows (Git Bash)

Install Node.js 10.x, Yarn, Git, and increase amount of inotify watchers

```bash
sudo apt update;
sudo apt install -y git nodejs npm curl;
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -;
apt-get install -y nodejs;
sudo ln -s /usr/bin/nodejs /usr/bin/node;
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -;
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list;
sudo apt-get update && sudo apt-get install yarn;
sudo ln -s /usr/bin/yarn /usr/local/bin/yarn;
yarn global add windows-build-tools;
```

### Clone this repo

```bash
git clone https://github.com/paritytech/fether
cd ./fether
yarn install
```

### Build and run

#### Build this repo and run

```bash
yarn electron
```

#### Build binaries

```bash
yarn package
```

#### Run with live reload for development

```bash
yarn start
```

### Run without taskbar mode (no tray icon)

```bash
TASKBAR=false yarn start
```

> Troubleshooting: If it hangs on a white screen in Electron even though it has compiled and has been syncing for a long time, then simply choose 'View > Reload' (CMD + R on Mac, CTRL + R on Linux/Windows) from the Fether/Electron menu.

> Developer Tools: Open developer tools automatically by running `DEBUG=true yarn start` when not in the production environment.


## Build binaries for production

### General Notes:

1) Alternative to `yarn; yarn build; DEBUG=electron-builder yarn release --mac;` is to just run `yarn package` and then run the `open "./packages/fether-electron/dist/mac/Parity Fether.app"` (i.e. no need to install)

2) Publishing a new release to GitHub is performed by a maintainer of the repository. In this case you need to obtain the `GH_TOKEN` from GitHub settings and add it using `export GH_TOKEN="..."` to ~/.bashrc and then run `source ~/.bashrc`. If you get an error that the `GH_TOKEN` is missing and you are only building the binary but not publishing, then just ignore the error.

### Mac

Build and run binaries (i.e. .dmg) for production on Mac of a specific remote branch

```bash
git fetch origin INSERT_BRANCH_NAME:INSERT_BRANCH_NAME;
git checkout INSERT_BRANCH_NAME;
rm -rf ./packages/fether-electron/dist/
rm -rf /Applications/Parity\ Fether.app/
yarn; yarn build; DEBUG=electron-builder yarn release --mac;
open ./packages/fether-electron/dist/Parity\ Fether-0.3.0.dmg
```

### Linux

Build and run binaries (i.e. .deb) for production on Linux

> Note: If you want to save time building, then first edit electron-builder.json so that it only builds a single binary like .deb instead of all of them

```bash
sudo rm -rf /opt/Parity\ Fether;
rm -rf ~/.config/Electron;
rm -rf ~/.config/fether;
rm -rf ./packages/fether-electron/dist/;
sudo rm /usr/local/bin/fether;
sudo apt remove -y fether;
yarn; yarn build; DEBUG=electron-builder yarn release --linux
sudo apt install -y ./packages/fether-electron/dist/fether_0.3.0_amd64.deb
fether
```

### Windows

Build and run binaries (i.e. .exe) binary for production on Windows

```bash
rm -rf /packages/fether-electron/dist;
yarn; yarn build; DEBUG=electron-builder yarn release --win;
./packages/fether-electron/dist/Parity\ Fether-0.3.0.exe
```

## Debugging in production

Show terminal logs whilst running a binary executable.

### Mac

```
tail -f ~/Library/Application\ Support/fether/fether.log
```

### Linux 

```
tail -f ~/.config/fether/fether.log
```

### Windows 

```
tail -f ~/Application\ Data/fether/fether.log
```

## Usage of taskbar mode

### Mac

Taskbar mode is `true` by default.

* Enabled `true`
  * Tray icon - Left-click or right-click the tray icon shows "tray context menu" containing just "Show/Hide Fether" and "Quit" options. "Show/Hide Fether" toggles the Fether window show/hide
  * Dock icon - no action
  * Fether window - frameless
* Disabled `false`
  * Dock icon - toggles show/hide Fether window
  * Fether window - frame (with close/minimise icons)
* Always
  * Menubar - Fether menu shown by default
  * Fether window - "window context menu" shown upon right-click in the Fether window
  * Fether window - position is saved upon move, minimising, and close so it is restored in the same position.

### Linux

Taskbar mode is `true` by default.

* Enabled `true`
  * Tray icon - Left-click or right-click the tray icon shows "tray context menu" containing just "Show/Hide Fether" and "Quit" options. "Show/Hide Fether" toggles the Fether window show/hide
  * Dock icon - toggles show/hide Fether window
  * Fether window - frameless
* Disabled `false`
  * Dock icon - toggles show/hide Fether window
  * Fether window - frame (with close/minimise icons)
  * Menubar - Fether menu may not be shown in the tray by default depending on whether `setMenuBarVisibility` has been set. Fether menu may be configured to automatically hide by setting `setAutoHideMenuBar`. Toggle show/hide the Fether menu in the frame by clicking the Fether window and then holding down the ALT key to reveal it, which only works if auto-hide menu bar is enabled.
* Always
  * Fether window - "window context menu" shown upon right-click in the Fether window
  * Fether window - position is saved upon move, minimising, and close so it is restored in the same position.

### Windows

Taskbar mode is `true` by default.

* Enabled `true`
  * Tray icon - Left-click toggles show/hide Fether window
  * Tray icon - Right-click the tray icon shows "tray context menu" containing just "Show/Hide Fether" and "Quit" options. "Show/Hide Fether" toggles the Fether window show/hide
  * Dock icon - toggles show/hide Fether window
  * Fether window - frameless
* Disabled `false`
  * Dock icon - toggles show/hide Fether window
  * Fether window - frame (with close/minimise icons).
  * Menubar - Fether menu may not be not shown in the tray by default depending on whether `setMenuBarVisibility` has been set. Fether menu may be configured to automatically hide by setting `setAutoHideMenuBar`. Toggle show/hide the Fether menu in the frame by clicking the Fether window and then holding down the ALT key to reveal it, which only works if auto-hide menu bar is enabled.
* Always
  * Fether window - "window context menu" shown upon right-click in the Fether window
  * Fether window - position is saved upon move, minimising, and close so it is restored in the same position.

