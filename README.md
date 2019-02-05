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

## Install and start Parity Fether

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
  
### Mac
- Download the [`.dmg` file](https://github.com/paritytech/fether/releases).
- Double click on it to install Fether.

### Windows
- Download the [`.exe` file](https://github.com/paritytech/fether/releases).
- Double click on it to install Fether.
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

### Dependencies

Make sure you have at least `yarn` version 1.4.2 and [Node.js >=10.10.0](https://nodejs.org/en/)

```bash
yarn --version // Should be at least 1.4.2
```

### Clone this repo

```bash
git clone https://github.com/paritytech/fether
cd ./fether
yarn install
```

### Build this repo and run

```bash
yarn electron
```

### Build binaries

```bash
yarn package
```

### Run with live reload for development

```bash
yarn start
```

> Troubleshooting: If it hangs on a white screen in Electron even though it has compiled and has been syncing for a long time, then simply choose 'View > Reload' (CMD + R on macOS) from the Fether/Electron menu. If the Fether menu is not shown in the tray, then by clicking the Fether window and then holding down the ALT key to reveal it.

> Developer Tools: Open developer tools automatically by running `DEBUG=true yarn start` when not in the production environment

# Run without taskbar mode (no tray icon)

```bash
TASKBAR=false yarn start
```

# Usage of taskbar mode

### macOS

Taskbar mode is `true` by default.

* Enabled `true`
  * Fether window may be toggled open/closed by clicking the Fether tray icon, but not the Fether dock icon
  * Fether window does not have a frame (i.e. no close/minimise icons)
* Disabled `false`
  * Fether window may be toggled open by clicking the Fether dock icon
  * Fether window has a frame (with close/minimise icons)
* Always
  * Fether menu shown in the tray by default
  * Fether window position is saved upon move, minimising, and close so it is restored in the same position.

### Linux

Taskbar mode is `true` by default.

* Enabled `true`
  * Fether window may be toggled minimise/restore by clicking the Fether tray icon to reveal a tooltip that says "Click to toggle Fether window" and then clicking the tooltip.
  * Fether window may not have a frame (i.e. no close/minimise icons) if `frame: false` in packages/fether-electron/src/main/app/options/config/index.js
* Disabled `false`
  * Fether window may be toggled open by clicking the Fether dock icon
  * Fether window has a frame (with close/minimise icons)
* Always
  * Fether menu may not be not shown in the tray by default depending on whether `setMenuBarVisibility` has been set. Show the Fether menu in the tray by clicking the Fether window and then holding down the ALT key to reveal it.
  * Fether menu may be configured to automatically hide by setting `setAutoHideMenuBar`
  * Fether window position is saved upon move, minimising, and close so it is restored in the same position.

### Windows

Taskbar mode is always `false` since the Fether menu does not appear without a frame on the Fether window.

* Disabled `false`
  * Fether window may be toggled open/minimise by clicking the Fether dock icon
  * Fether window has a frame (with close/minimise icons).
* Always
  * Fether menu is shown in the Fether window by clicking the Fether window and then holding down the ALT key to reveal it.
  * Fether menu may be configured to automatically hide by setting `setAutoHideMenuBar`
  * Fether tray icon does nothing
  * Fether window position is saved upon move, minimising, and close so it is restored in the same position.

## Join the chat!

Get in touch with us on Gitter:
[![Gitter](https://img.shields.io/badge/Gitter-Fether-brightgreen.svg)](https://gitter.im/paritytech/fether)

Official website: https://parity.io | Be sure to check out [our Wiki](https://wiki.parity.io) for more information.
