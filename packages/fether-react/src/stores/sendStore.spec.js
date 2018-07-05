// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

/* eslint-env jest */

import lightJs from '@parity/light.js'; // Mocked

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
  makeContract$: jest.fn(() => ({
    transfer$: jest.fn(() => ({ subscribe: jest.fn() }))
  })),
  post$: jest.fn(() => ({
    subscribe: jest.fn(callback => {
      setTimeout(callback({ estimating: true }), 100); // eslint-disable-line standard/no-callback-literal
      setTimeout(callback({ requested: 1 }), 200); // eslint-disable-line standard/no-callback-literal
    })
  }))
}));

jest.mock('./parityStore', () => ({
  api: {
    signer: {
      confirmRequest: jest.fn(() => Promise.resolve(true))
    }
  }
}));

jest.mock('./tokensStore', () => ({
  tokens: {
    ETH: { decimals: 18 },
    foo: { decimals: 18 }
  }
}));

const mockTx = {
  amount: 0.01, // In Ether or in token
  gasPrice: 4, // in Gwei
  to: '0x123'
};

const mockErc20Token = {
  address: 'foo',
  decimals: 18
};

const mockEthToken = {
  address: 'ETH'
};

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
    sendStore.setTx(mockTx);
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
    sendStore.setTx(mockTx);
  });

  test.skip('should call transfer$ if the token is Erc20 and subscribe to it', () => {
    sendStore.send(mockErc20Token);
    expect(sendStore.contract.transfer$).toHaveBeenCalled();
  });

  test('should call post$ if the token is ETH  and subscribe to it', () => {
    sendStore.send(mockEthToken);
    expect(lightJs.post$).toHaveBeenCalled();
  });

  test('should update txStatus', () => {
    sendStore.setTxStatus = jest.fn();
    sendStore.send(mockEthToken);
    expect(sendStore.setTxStatus).toHaveBeenCalledWith({ estimating: true });
  });

  test('should call acceptRequest when txStatus is requested', () => {
    sendStore.acceptRequest = jest.fn(() => Promise.resolve(true));
    sendStore.send(mockEthToken, 'foo');
    expect(sendStore.acceptRequest).toHaveBeenCalledWith(1, 'foo');
  });
});

storeTests.setterTest(SendStore, 'blockNumber');
storeTests.setterTest(SendStore, 'tx');
storeTests.setterTest(SendStore, 'txStatus');
