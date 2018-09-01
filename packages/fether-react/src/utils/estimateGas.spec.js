// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

/* eslint-env jest */

import abi from '@parity/contracts/lib/abi/eip20';
import BigNumber from 'bignumber.js';
import lightJs from '@parity/light.js';

import { estimateGas, contractForToken } from './estimateGas';
import * as mock from './testHelpers/mock';

jest.mock('@parity/light.js', () => ({
  makeContract: jest.fn(() => mock.makeContract)
}));

describe('contractForToken', () => {
  test('should call makeContract', () => {
    contractForToken('foo');
    expect(lightJs.makeContract).toHaveBeenCalledWith('foo', abi);
  });

  test('should be memoized', () => {
    const a = contractForToken('foo');
    const b = contractForToken('foo');
    expect(a).toBe(b);
  });
});

describe('estimateGas', () => {
  test('should throw error if no tx is set', () => {
    expect(estimateGas(null)).rejects.toHaveProperty('message', 'Tx not set.');
  });

  test('should throw error if tx is empty', () => {
    expect(estimateGas({})).rejects.toHaveProperty('message', 'Tx not set.');
  });

  test('should call estimateGasForErc20 with token', () => {
    expect(estimateGas(mock.tx, mock.erc20, mock.api)).resolves.toEqual(
      new BigNumber(153.75)
    );
  });

  test('should call estimateGasForEth with token', () => {
    expect(estimateGas(mock.tx, mock.eth, mock.api)).resolves.toEqual(
      new BigNumber(570)
    );
  });
});
