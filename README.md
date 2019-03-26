![Parity Fether](https://wiki.parity.io/images/logo-parity-fether.jpg)

# Parity Fether - a decentralised, light client-based wallet

## [» Download the latest release «](https://github.com/paritytech/fether/releases)


---

## About Parity Fether

Parity Fether aims to be the lightest and simplest decentralized wallet. It supports Ether and ERC-20 tokens, and runs on top of [Parity Ethereum](https://github.com/paritytech/parity-ethereum) light client. This allows smooth synchronization and interaction with the Ethereum blockchain, in a decentralized manner.

By default, Parity Fether alpha runs on the Kovan test network. You can receive free Kovan Ether by posting your address in the [Kovan Faucet](https://gitter.im/kovan-testnet/faucet) Gitter channel. Fether will download and launch Parity Ethereum node at startup if it's not found on the computer. You can also separately launch your Ethereum client, Fether will automatically connect to it.

Parity Fether connects to the light node using [`@parity/light.js`](https://github.com/paritytech/js-libs/tree/master/packages/light.js), a Javascript library specifically crafted for wallets to connect with light clients. 

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

## Internationalisation

English language support is currently the default. Contributors are invited to create a Pull Request with a conversion into another language. Please [refer to the Fether FAQ](https://wiki.parity.io/Fether-FAQ) for usage instructions and to learn how to add a new language.

**FIXME i18n** - move the following sections to the FAQ in the wiki

### Usage

Switch between languages when multiple languages are available by going to the Fether Menu > Preferences > Language, and choosing one from the list. The active language has a tick next to it.

### Add New Language

Follow these steps to add support for an additional language:

#### Example: Add language support for the German language

**Solution:** See the following commit for the changes required to add German language support https://github.com/paritytech/fether/commit/d53dbb9e68ab52aedb02115858d5bd5e9e8a0e5d

1) [Language internationalisation abbreviation](https://www.w3.org/International/O-charset-lang.html) for the new language. The language will be referred to as <LANG>. Example: 'de' for Deutsch (German), or 'en' for English.
2) Language conversion of the Fether menu item names to the new language.
* Create a file named <LANG>.json within the fether-electron folder. Example: fether-electron/src/main/app/menu/i18n/locales/de.json. Copy/paste into it the contents of the English file fether-electron/src/main/app/menu/i18n/locales/en.json. Find a native speaker in that language to convert each **value** (not key) into the new language.
* Update fether-electron/src/main/app/menu/i18n/locales/index.js
* Update fether-electron/src/main/app/menu/template/index.js, which includes:
  * Adding item for the new language as a value of the `submenu`. 
* Update fether-electron/src/main/app/menu/i18n/index.js, which includes:
  * Import the <LANG> from the 'locales' subdirectory 
  * Adding the new language as a fallback language in the desired order to the `fallbackLng`.
  * Adding a key named <LANG> to `resources` using the imported <LANG>.json file as the namespace `ns1`.
3) Language conversion of the Fether window contents to the new language.
* Create a file named <LANG>.json within the fether-react folder. Example: fether-react/src/i18n/locales/de.json. Copy/paste into it the contents of the English file fether-react/src/i18n/locales/en.json. Find a native speaker in that language to convert each **value** (not key) into the new language.
* Update fether-react/src/i18n/locales/index.js.
* Update fether-react/src/i18n/index.js, which includes:
  * Import the <LANG> from the 'locales' subdirectory 
  * Adding the new language as a fallback language in the desired order to the `fallbackLng`.
  * Adding a key named <LANG> to `resources` using the imported <LANG>.json file as the namespace `ns1`.

### Known Issues

* After choosing a new language to switch to, the Fether window will refresh automatically and the contents of Fether will be in the new language, except for the menu items "Show/Hide Fether" and "Quit" that are shown when you click the taskbar icon, which only changes to the chosen language after you have restarted Fether.

* The Fether Terms & Conditions are only available in English.
