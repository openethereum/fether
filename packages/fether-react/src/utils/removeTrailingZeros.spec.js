// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

/* eslint-env jest */

import BigNumber from 'bignumber.js';
import { fromWei, toWei } from '@parity/api/lib/util/wei';

import { removeTrailingZeros } from './removeTrailingZeros';

describe('removeTrailingZeros', () => {
  test('removes trailing zeros from big number decimal value', () => {
    const amount = '0.0000000001';
    const estimatedTxFee = new BigNumber('84000000000000');

    const valueWithTrailingZeros = fromWei(
      estimatedTxFee.plus(toWei(amount)),
      'ether'
    )
      .toFixed(18)
      .toString();

    expect(valueWithTrailingZeros).toEqual('0.000084000100000000');
    expect(removeTrailingZeros(valueWithTrailingZeros)).toEqual('0.0000840001');
  });

  test('removes trailing zeros from decimal value without preceding zero', () => {
    const valueWithTrailingZeros = '.0000000000000000010';
    expect(removeTrailingZeros(valueWithTrailingZeros)).toEqual(
      '.000000000000000001'
    );
  });

  test('does not change integer value with trailing zero', () => {
    const valueWithTrailingZeros = '10';
    expect(removeTrailingZeros(valueWithTrailingZeros)).toEqual('10');
  });

  test('does not change integer value with preceding and trailing zero', () => {
    const valueWithTrailingZeros = '010';
    expect(removeTrailingZeros(valueWithTrailingZeros)).toEqual('010');
  });

  test('does not change decimal value with no digits after decimal point', () => {
    const valueWithTrailingZeros = '010.';
    expect(removeTrailingZeros(valueWithTrailingZeros)).toEqual('010.');
  });
});
