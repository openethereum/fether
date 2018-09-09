![Parity Fether](https://wiki.parity.io/images/logo-parity-fether.jpg)

# Parity Fether - a fast and decentralized wallet based on a light-client

## [» Download the latest release «](https://github.com/paritytech/fether/releases)


---

## About Parity Fether

Parity Fether aims to be the lightest and simplest decentralized wallet. It supports Ether and ERC-20 tokens, and runs on top of [Parity Ethereum](https://github.com/paritytech/parity-ethereum) light client. This allows smooth synchronization and interaction with the Ethereum blockchain, in a decentralized manner.

By default, Parity Fether alpha runs on the Kovan test network. You can receive free Kovan Ether by posting your address in the [Kovan Faucet](https://gitter.im/kovan-testnet/faucet) Gitter channel. Fether will download and launch Parity Ethereum node at startup if it's not found on the computer. You can also separately launch your Ethereum client, Fether will automatically connect to it.

Parity Fether connects to the light node using [`@parity/light.js`](https://github.com/paritytech/js-libs/tree/master/packages/light.js), a Javascript library specifically crafted for wallets to connect with light clients. It is licensed under the BSD 3-Clause, and can be used for all your Ethereum needs.

If you run into problems while using Parity Fether, feel free to file an issue in this repository or hop on our [Gitter](https://gitter.im/paritytech/parity) or [Riot](https://riot.im/app/#/group/+parity:matrix.parity.io) chat room to ask a question. We are glad to help! **For security-critical issues**, please refer to the security policy outlined in [SECURITY.md](https://github.com/paritytech/parity/blob/master/SECURITY.md).

---

## Screenshots

![Parity Fether](https://wiki.parity.io/images/fether-screenshot-0.jpg)

## Start Parity Fether

### Using the command line

To start Parity Fether manually, simply run:

```bash
$ /path/to/fether
```

Fether will launch a Partity Ethereum light node and print its output in the command line.

### Passing config flags to the underlying Parity Ethereum node

You can pass specific flags for fether to launch the underlying Parity Ethereum with:

```bash
# Launching Parity Ethereum light client on Ropsten instead of Kovan (default) and connect Fether to it
$ /path/to/fether --chain ropsten --light
```

### Separately launch Parity Ethereum node

You can also launch Parity Ethereum node before, with any flag you want:

```bash
# Launching Parity Ethereum lieght client on Ropsten instead of Kovan (default)
$ parity --chain ropsten --light
```

In another console launch Fether:

```bash
# Fether will connect to the running node
$ /path/to/fether
```

## Build from sources

### Dependencies

Make sure you have at least `yarn` version 1.4.2

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

## Join the chat!

Get in touch with us on Gitter:
[![Gitter](https://img.shields.io/badge/Gitter-Fether-brightgreen.svg)](https://gitter.im/paritytech/fether)

Official website: https://parity.io | Be sure to check out [our Wiki](https://wiki.parity.io) for more information.
