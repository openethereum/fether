// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

/* eslint-env jest */

import sendStore from './sendStore';
import * as storeTests from '../utils/testHelpers/storeTests';

storeTests.setterTest(sendStore, 'blockNumber');
storeTests.setterTest(sendStore, 'tokenAddress');
storeTests.setterTest(sendStore, 'tx');
storeTests.setterTest(sendStore, 'txStatus');

describe('@computed confirmations', () => {
  test('return correct value if txStatus is not set', () => {
    sendStore.setTxStatus(null);
    expect(sendStore.confirmations).toBe(-1);
  });

  test('return correct value if txStatus is not `confirmed`', () => {
    sendStore.setTxStatus({ estimating: true });
    expect(sendStore.confirmations).toBe(-1);
  });

  test('return correct value if txStatus is `confirmed`', () => {
    sendStore.setBlockNumber(5);
    sendStore.setTxStatus({ confirmed: { blockNumber: 4 } });
    expect(sendStore.confirmations).toBe(1);
  });
});
