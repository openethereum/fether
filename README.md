# Parity Fether a fast and decentralized wallet based on a light-client

## Get the latest binary

[» Download the latest release «](https://github.com/paritytech/fether/releases)


### Join the chat!

Get in touch with us on Gitter:
[![Gitter: Parity](https://img.shields.io/badge/gitter-parity-4AB495.svg)](https://gitter.im/paritytech/parity)


Official website: https://parity.io | Be sure to check out [our Wiki](https://wiki.parity.io) for more information.

----

## About Parity Fether

Fether aims to be the lightest and simplest decentralized wallet. It supports Ether and ERC-20 tokens and runs on top of [Parity Ethereum](https://github.com/paritytech/parity) light client allowing smooth synchronization and interaction with the Ethereum blockchain, in a decentralized manner.

By default, Parity Fether alpha runs on the Kovan test network. You can receive free Kovan Ether by posting your address in the [Kovan Faucet](https://gitter.im/kovan-testnet/faucet) Gitter channel. Fether will download and launch Parity Ethereum node at startup if it's not found on the computer. You can also separately launch your Ethereum client, Fether will automatically connect to it.

If you run into problems while using Parity Fether, feel free to file an issue in this repository or hop on our [Gitter](https://gitter.im/paritytech/parity) or [Riot](https://riot.im/app/#/group/+parity:matrix.parity.io) chat room to ask a question. We are glad to help! **For security-critical issues**, please refer to the security policy outlined in [SECURITY.md](https://github.com/paritytech/parity/blob/master/SECURITY.md).

Parity Fether connects to the light node using light.js, a Javascript library specifically crafted for Wallets to connect with light clients. It is licensed under the BSD 3-Clause, and can be used for all your Ethereum needs.

----

## Start Parity Fether

### Manually

To start Parity Fether manually, just run

```bash
$ fether
```
You can pass specific flags to the underlying Parity Ethereum node such as:

```bash
$ fether --chain ropsten
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

## Build this repo and run

```bash
yarn electron
```

## Build binaries

```bash
yarn package
```

## Run with live reload for development

```bash
yarn start
```
