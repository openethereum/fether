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
  describe('blockscout', () => {
    test('should not trust insecure (non-https) links', () => {
      url = 'http://blockscout.com';

      expect(isTrustedUrlPattern(url)).toBe(false);
    });

    test('should trust link to internal transaction on ethereum mainnet', () => {
      url =
        'https://blockscout.com/eth/mainnet/tx/0xfe7e97d1de24b47d92e815024757e388809425f1681920bc1923368ec1f0fcf1/internal_transactions';

      expect(isTrustedUrlPattern(url)).toBe(true);
    });
  });

  describe('github token icons', () => {
    test('should trust token .png icons from Github ethcore', () => {
      url =
        'https://raw.githubusercontent.com/ethcore/dapp-assets/9e135f76fe9ba61e2d8ccbd72ed144c26c450780/tokens/gavcoin-64x64.png';

      expect(isTrustedUrlPattern(url)).toBe(true);
    });

    test('should trust token .svg icons from Github ethcore', () => {
      url =
        'https://raw.githubusercontent.com/ethcore/dapp-assets/9e135f76fe9ba61e2d8ccbd72ed144c26c450780/tokens/gavcoin-64x64.svg';

      expect(isTrustedUrlPattern(url)).toBe(true);
    });

    test('should trust token icons from Github atomiclabs', () => {
      url =
        'https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/25376220e0a5cda085b6b25a7a6d528531246b89/32/black/arg.png';

      expect(isTrustedUrlPattern(url)).toBe(true);
    });
  });

  describe('chrome developer tools', () => {
    url =
      'chrome-devtools://devtools/bundled/toolbox.html?remoteBase=https://chrome-devtools-frontend.appspot.com/serve_file/@123/&can_dock=true&toolbarColor=rgba(223,223,223,1)&textColor=rgba(0,0,0,1)&experiments=true';

    expect(isTrustedUrlPattern(url)).toBe(false);
  });
});
