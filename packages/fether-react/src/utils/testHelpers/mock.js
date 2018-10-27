// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

/* eslint-env jest */

import BigNumber from 'bignumber.js';

export const api = {
  eth: {
    estimateGas: jest.fn(() => Promise.resolve(new BigNumber(456)))
  },
  parity: {
    generateSecretPhrase: jest.fn(() => Promise.resolve('foo')),
    newAccountFromPhrase: jest.fn(() => Promise.resolve()),
    phraseToAddress: jest.fn(() => Promise.resolve('0x123')),
    setAccountName: jest.fn(() => Promise.resolve()),
    setAccountMeta: jest.fn(() => Promise.resolve())
  },
  signer: {
    confirmRequest: jest.fn(() => Promise.resolve(true))
  }
};

export const erc20 = {
  address: 'foo',
  decimals: 18
};

export const eth = {
  address: 'ETH'
};

export const makeContract = {
  contractObject: {
    instance: {
      transfer: {
        estimateGas: () => Promise.resolve(new BigNumber(123))
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

export const tx = {
  amount: 0.01, // In Ether or in token
  from: '0x456',
  gasPrice: 4, // in Gwei
  to: '0x123'
};
