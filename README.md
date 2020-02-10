# ⚠️ This application is not actively maintained any more.
Fether was originally developed on top of Parity Ethereum which transitions to Open Ethereum, [more info here]( https://www.parity.io/parity-ethereum-openethereum-dao/). As a result, Parity Technologies will not maintain actively Fether anymore.

![Parity Fether](https://wiki.parity.io/images/logo-parity-fether.jpg)

## Parity Fether - a decentralised, light client-based wallet
[» Download the latest release «](https://github.com/paritytech/fether/releases)


---

## About Parity Fether

Parity Fether aims to be the lightest and simplest decentralized wallet. It supports Ether and ERC-20 tokens, and runs on top of [Parity Ethereum](https://github.com/paritytech/parity-ethereum) light client. This allows smooth synchronization and interaction with the Ethereum blockchain, in a decentralized manner.

By default, Fether will launch its embedded Parity Ethereum light client. You can also separately launch your Ethereum client and Fether will automatically connect to it, as described in the [Fether FAQ](https://wiki.parity.io/Fether-FAQ#how-to-launch-fether-with-a-separately-launched-parity-ethereum-node).

Parity Fether interacts with the light node using [`@parity/light.js`](https://github.com/paritytech/js-libs/tree/master/packages/light.js), a Javascript library specifically crafted for wallets to connect with light clients. 

Parity Fether is licensed under the BSD 3-Clause, and can be used for all your Ethereum needs.

If you run into problems while using Parity Fether, first check out the [FAQ](https://wiki.parity.io/Fether-FAQ) on our wiki and feel free to file an issue in this repository or hop on our [Gitter](https://gitter.im/paritytech/fether) or [Riot](https://riot.im/app/#/group/+parity:matrix.parity.io) chat rooms if you have any question. We are glad to help!  

**For security-critical issues**, please refer to the security policy outlined in [SECURITY.md](https://github.com/paritytech/parity/blob/master/SECURITY.md).

---

## Screenshots

![Parity Fether](https://wiki.parity.io/images/fether-screenshot-0.jpg)


## Join the chat!

Get in touch with us on Gitter:
[![Gitter](https://img.shields.io/badge/Gitter-Fether-brightgreen.svg)](https://gitter.im/paritytech/fether)

Official website: https://parity.io | Be sure to check out [our Wiki](https://wiki.parity.io) for more information.

## Install and start Parity Fether using binaries

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

## Security warning

- ### Don't run Fether as root
- ### Beware of suspicious symlinks called fether-x.y.z-x86_64.AppImage.home
This attack vector applies to any AppImage application. It consists of crafting a .home file/folder to be used as the home folder by an AppImage application. The danger resides in the fact that this .home file could be a symlink somewhere on the user's computer. The AppImage would be using this new location as a home folder, in a non-transparent way. Running the application as root might damage a system, for example, by overflowing the /boot partition.

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
