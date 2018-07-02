// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

/* eslint-env jest */

import abi from '@parity/shared/lib/contracts/abi/eip20';
import BigNumber from 'bignumber.js';
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
    contractObject: {
      instance: {
        transfer: { estimateGas: jest.fn(() => Promise.resolve(123)) }
      }
    },
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
    eth: {
      estimateGas: jest.fn(() => Promise.resolve(123))
    },
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

describe('@computed contract', () => {
  test('should create a contract with correct token address if the current token Erc20', () => {
    sendStore.setTokenAddress('foo');
    sendStore.contract; // eslint-disable-line
    expect(lightJs.makeContract$).toHaveBeenCalledWith('foo', abi);
  });

  test('should return null if the current token is ETH', () => {
    sendStore.setTokenAddress('ETH');
    expect(sendStore.contract).toBe(null);
  });
});

describe('method estimateGas', () => {
  test('should not estimate if no tx is set', () => {
    sendStore.estimateGasForErc20 = jest.fn();
    sendStore.estimateGasForEth = jest.fn();
    expect(sendStore.estimateGas()).toBe(undefined);
    expect(sendStore.estimateGasForErc20).not.toHaveBeenCalled();
    expect(sendStore.estimateGasForEth).not.toHaveBeenCalled();
  });

  test('should call estimateGasForErc20 if the current token is Erc20', () => {
    sendStore.estimateGasForErc20 = jest.fn(() => 'estimateGasForErc20');
    sendStore.setTokenAddress('foo');
    sendStore.setTx(mockTx);
    expect(sendStore.estimateGas()).toBe('estimateGasForErc20');
    expect(sendStore.estimateGasForErc20).toHaveBeenCalled();
  });

  test('should call estimateGasForEth if the current token is ETH', () => {
    sendStore.estimateGasForEth = jest.fn(() => 'estimateGasForEth');
    sendStore.setTokenAddress('ETH');
    sendStore.setTx(mockTx);
    expect(sendStore.estimateGas()).toBe('estimateGasForEth');
    expect(sendStore.estimateGasForEth).toHaveBeenCalled();
  });
});

describe('method estimateGasForErc20', () => {
  beforeEach(() => {
    sendStore.setTokenAddress('foo');
  });

  test.skip('should call the transfer method on the contract', () => {
    sendStore.estimateGasForErc20(mockTx);
    expect(
      sendStore.contract.contractObject.instance.transfer.estimateGas
    ).toHaveBeenCalledWith(mockTx);
  });

  test('should memoize result', () => {
    const a = sendStore.estimateGasForErc20(mockTx);
    const b = sendStore.estimateGasForErc20(mockTx);
    expect(a).toBe(b);
  });
});

describe('method estimateGasForEth', () => {
  beforeEach(() => {
    sendStore.setTokenAddress('ETH');
  });

  test('should call api.eth.estimateGas', () => {
    sendStore.estimateGasForEth(mockTx);
    expect(parityStore.api.eth.estimateGas).toHaveBeenCalledWith(mockTx);
  });

  test('should memoize result', () => {
    const a = sendStore.estimateGasForEth(mockTx);
    const b = sendStore.estimateGasForEth(mockTx);
    expect(a).toBe(b);
  });
});

describe('method send', () => {
  beforeEach(() => {
    sendStore.setTx(mockTx);
  });

  test.skip('should call transfer$ if the token is Erc20 and subscribe to it', () => {
    sendStore.setTokenAddress('foo');
    sendStore.send();
    expect(sendStore.contract.transfer$).toHaveBeenCalledWith(
      sendStore.txForErc20
    );
  });

  test('should call post$ if the token is ETH  and subscribe to it', () => {
    sendStore.setTokenAddress('ETH');
    sendStore.send();
    expect(lightJs.post$).toHaveBeenCalledWith(sendStore.txForEth);
  });

  test('should update txStatus', () => {
    sendStore.setTxStatus = jest.fn();
    sendStore.setTokenAddress('ETH');
    sendStore.send();
    expect(sendStore.setTxStatus).toHaveBeenCalledWith({ estimating: true });
  });

  test('should call acceptRequest when txStatus is requested', () => {
    sendStore.acceptRequest = jest.fn(() => Promise.resolve(true));
    sendStore.setTokenAddress('ETH');
    sendStore.send('foo');
    expect(sendStore.acceptRequest).toHaveBeenCalledWith(1, 'foo');
  });
});

describe('setter setEstimated', () => {
  test('should add a 1.33 factor', () => {
    sendStore.setEstimated(new BigNumber(2));
    expect(sendStore.estimated).toEqual(new BigNumber(2 * 1.33));
  });
});

describe('@computed txForErc20', () => {
  test('should return correct value', () => {
    sendStore.setTokenAddress('foo');
    sendStore.setTx(mockTx);
    expect(sendStore.txForErc20).toEqual({
      args: ['0x123', new BigNumber('10000000000000000')],
      options: { gasPrice: new BigNumber('4000000000') }
    });
  });
});

describe('@computed txForEth', () => {
  test('should return correct value', () => {
    sendStore.setTokenAddress('foo');
    sendStore.setTx(mockTx);
    expect(sendStore.txForEth).toEqual({
      gasPrice: new BigNumber('4000000000'),
      to: '0x123',
      value: new BigNumber('10000000000000000')
    });
  });
});

storeTests.setterTest(SendStore, 'blockNumber');
storeTests.setterTest(SendStore, 'tokenAddress');
storeTests.setterTest(SendStore, 'tx');
storeTests.setterTest(SendStore, 'txStatus');
