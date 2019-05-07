// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

/* eslint-env jest */

import BigNumber from 'bignumber.js';
import lightJs from '@parity/light.js'; // Mocked

import * as mock from '../utils/testHelpers/mock';
import { SendStore } from './sendStore';
import * as storeTests from '../utils/testHelpers/storeTests';

jest.mock('@parity/light.js', () => ({
  blockNumber$: jest.fn(() => ({
    subscribe: () =>
      jest.fn(() => ({
        unsubscribe: jest.fn()
      }))
  })),
  makeContract: jest.fn(() => mock.makeContract),
  post$: jest.fn(() => mock.post$)
}));

let sendStore; // Will hold the newly created instance of SendStore in each test
beforeEach(() => {
  sendStore = new SendStore();
});

describe('method clear', () => {
  test('should clear txEth', () => {
    sendStore.setTx(mock.txEth);
    sendStore.clear();
    expect(sendStore.tx).toEqual({});
  });

  test('should clear txErc20', () => {
    sendStore.setTx(mock.txErc20);
    sendStore.clear();
    expect(sendStore.tx).toEqual({});
  });

  test('should unsubscribe', () => {
    sendStore.subscription = { unsubscribe: jest.fn() };
    sendStore.clear();
    expect(sendStore.subscription.unsubscribe).toHaveBeenCalled();
  });
});

describe('@computed confirmations', () => {
  test('should return correct value if txStatus is not set', () => {
    sendStore.setTxStatus(null);
    expect(sendStore.confirmations).toBe(-1);
  });

  test('should return correct value if txStatus is not `confirmed`', () => {
    sendStore.setTxStatus({ estimating: true });
    expect(sendStore.confirmations).toBe(-1);
  });

  test('should return correct value if txStatus is `confirmed`', () => {
    sendStore.setBlockNumber(5);
    sendStore.setTxStatus({ confirmed: { blockNumber: 4 } });
    expect(sendStore.confirmations).toBe(1);
  });
});

describe('method send', () => {
  test('should call transfer$ if the token is Erc20', () => {
    sendStore.setTx(mock.txErc20);
    sendStore.send('passphrase');
    expect(mock.txErc20.token.address).toEqual('THIBCoin');
    expect(mock.makeContract.transfer$).toHaveBeenCalledWith(
      '0x123',
      new BigNumber('10000000000000000'),
      {
        from: '0x456',
        gasPrice: new BigNumber('4000000000'),
        passphrase: 'passphrase'
      }
    );
  });

  test('should call post$ if the token is ETH', () => {
    sendStore.setTx(mock.txEth);
    sendStore.send('passphrase');
    expect(mock.txEth.token.address).toEqual('ETH');
    expect(lightJs.post$).toHaveBeenCalledWith(
      {
        from: '0x456',
        gasPrice: new BigNumber('4000000000'),
        to: '0x123',
        value: new BigNumber('10000000000000000')
      },
      {
        passphrase: 'passphrase'
      }
    );
  });

  test('should call post$ if the token is ETC', () => {
    sendStore.setTx(mock.txEtc);
    sendStore.send('passphrase');
    expect(mock.txEtc.token.address).toEqual('ETC');
    expect(lightJs.post$).toHaveBeenCalledWith(
      {
        from: '0x456',
        gasPrice: new BigNumber('4000000000'),
        to: '0x123',
        value: new BigNumber('10000000000000000')
      },
      {
        passphrase: 'passphrase'
      }
    );
  });

  test('should update txStatus if the token is ETH', () => {
    sendStore.setTxStatus = jest.fn();
    sendStore.setTx(mock.txEth);
    sendStore.send('passphrase');
    expect(mock.txEth.token.address).toEqual('ETH');
    expect(sendStore.setTxStatus).toHaveBeenCalledWith({ estimating: true });
  });

  test('should update txStatus if the token is ETC', () => {
    sendStore.setTxStatus = jest.fn();
    sendStore.setTx(mock.txEtc);
    sendStore.send('passphrase');
    expect(mock.txEtc.token.address).toEqual('ETC');
    expect(sendStore.setTxStatus).toHaveBeenCalledWith({ estimating: true });
  });
});

storeTests.setterTest(SendStore, 'blockNumber');
storeTests.setterTest(SendStore, 'tx');
storeTests.setterTest(SendStore, 'txStatus');
