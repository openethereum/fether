// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

/* eslint-env jest */

import BigNumber from 'bignumber.js';
import lightJs from '@parity/light.js'; // Mocked

import * as mock from '../utils/testHelpers/mock';
import parityStore from './parityStore';
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

jest.mock('./parityStore', () => ({
  api: mock.api
}));

let sendStore; // Will hold the newly created instance of SendStore in each test
beforeEach(() => {
  sendStore = new SendStore();
});

describe('method acceptRequest', () => {
  test('should call api.signer.confirmRequest', () => {
    sendStore.acceptRequest(1, 'foo');
    expect(parityStore.api.signer.confirmRequest).toHaveBeenCalledWith(
      1,
      null,
      'foo'
    );
  });

  test('should set a subscription on blockNumber$', () => {
    sendStore.acceptRequest(1, 'foo');
    expect(lightJs.blockNumber$).toHaveBeenCalled();
  });
});

describe('method clear', () => {
  test('should clear tx', () => {
    sendStore.setTx(mock.tx);
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
  beforeEach(() => {
    sendStore.setTx(mock.tx);
  });

  test('should call transferFrom$ if the token is Erc20', () => {
    sendStore.send(mock.erc20);
    expect(mock.makeContract.transferFrom$).toHaveBeenCalledWith(
      '0x456',
      '0x123',
      new BigNumber('10000000000000000'),
      { gasPrice: new BigNumber('4000000000') }
    );
  });

  test('should call post$ if the token is ETH', () => {
    sendStore.send(mock.eth);
    expect(lightJs.post$).toHaveBeenCalledWith({
      from: '0x456',
      gasPrice: new BigNumber('4000000000'),
      to: '0x123',
      value: new BigNumber('10000000000000000')
    });
  });

  test('should update txStatus', () => {
    sendStore.setTxStatus = jest.fn();
    sendStore.send(mock.eth);
    expect(sendStore.setTxStatus).toHaveBeenCalledWith({ estimating: true });
  });

  test('should call acceptRequest when txStatus is requested', () => {
    sendStore.acceptRequest = jest.fn(() => Promise.resolve(true));
    sendStore.send(mock.eth, 'foo');
    expect(sendStore.acceptRequest).toHaveBeenCalledWith(1, 'foo');
  });
});

storeTests.setterTest(SendStore, 'blockNumber');
storeTests.setterTest(SendStore, 'tx');
storeTests.setterTest(SendStore, 'txStatus');
