// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

/* eslint-env jest */

import BigNumber from 'bignumber.js';
import { toWei } from '@parity/api/lib/util/wei';

const SECRET_PHRASE = 'foo';
const ADDRESS_FROM = '0x456';
const ADDRESS_TO = '0x123';
const GAS_PRICE = 4; // in Gwei
const GAS_ESTIMATE = 456;
const GAS_ESTIMATE_CONTRACT_TX = 123;
const AMOUNT = 0.01;

export const api = {
  eth: {
    estimateGas: jest.fn(() => Promise.resolve(new BigNumber(GAS_ESTIMATE)))
  },
  parity: {
    generateSecretPhrase: jest.fn(() => Promise.resolve(SECRET_PHRASE)),
    newAccountFromPhrase: jest.fn(() => Promise.resolve()),
    phraseToAddress: jest.fn(() => Promise.resolve(ADDRESS_TO)),
    setAccountName: jest.fn(() => Promise.resolve()),
    setAccountMeta: jest.fn(() => Promise.resolve())
  },
  signer: {
    confirmRequest: jest.fn(() => Promise.resolve(true))
  }
};

export const erc20 = {
  address: 'THIBCoin',
  decimals: 18
};

export const eth = {
  address: 'ETH'
};

export const etc = {
  address: 'ETC'
};

export const makeContract = {
  contractObject: {
    instance: {
      transfer: {
        estimateGas: () =>
          Promise.resolve(new BigNumber(GAS_ESTIMATE_CONTRACT_TX))
      }
    }
  },
  transfer$: jest.fn(() => ({ subscribe: jest.fn() }))
};

export const post$ = {
  subscribe: jest.fn(callback => {
    setTimeout(callback({ estimating: true }), 100); // eslint-disable-line standard/no-callback-literal
    setTimeout(callback({ requested: 1 }), 200); // eslint-disable-line standard/no-callback-literal
  })
};

export const txEth = {
  amount: AMOUNT, // In Ether
  from: ADDRESS_FROM,
  gasPrice: GAS_PRICE,
  to: ADDRESS_TO,
  token: eth
};

export const txEtc = {
  amount: AMOUNT, // In Ether
  from: ADDRESS_FROM,
  gasPrice: GAS_PRICE,
  to: ADDRESS_TO,
  token: etc
};

const txErc20Base = {
  amount: AMOUNT, // In token
  from: ADDRESS_FROM,
  gasPrice: GAS_PRICE,
  to: ADDRESS_TO,
  token: erc20
};

export const txErc20 = {
  ...txErc20Base,
  args: [
    txErc20Base.to,
    new BigNumber(txErc20Base.amount).multipliedBy(
      new BigNumber(10).pow(txErc20Base.token.decimals)
    )
  ],
  options: {
    from: txErc20Base.from,
    gasPrice: toWei(txErc20Base.gasPrice, 'shannon') // shannon == gwei
  }
};
