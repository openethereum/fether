// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

/* eslint-env jest */

import isTrustedUrlPattern from './isTrustedUrlPattern';

jest.mock('./pino', () => () => ({
  info: () => {}
}));

let url;

describe('trust url pattern', () => {
  test('should not trust insecure (non-https) links', () => {
    url = 'http://blockscout.com';

    expect(isTrustedUrlPattern(url)).toEqual(false);
  });

  test('should trust link to internal transaction on ethereum mainnet', () => {
    url =
      'https://blockscout.com/eth/mainnet/tx/0xfe7e97d1de24b47d92e815024757e388809425f1681920bc1923368ec1f0fcf1/internal_transactions';

    expect(isTrustedUrlPattern(url)).toEqual(true);
  });
});
