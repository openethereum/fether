// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

const BLOCKSCOUT_URL_REGEXP = new RegExp(
  '^https://blockscout.com/(eth|etc|poa)/(mainnet|classic|ropsten|kovan|goerli|core|dai|sokol|rinkeby)/(tx|address)/0x[a-fA-F0-9]+/(internal_transacations|token_transfers)$'
);

const ALLOWED_URLS = [
  'https://github.com/paritytech/fether/issues/new',
  'mailto:press@parity.io',
  'https://wiki.parity.io/Fether-FAQ#how-to-fix-a-webcam-error',
  'https://opensource.org/licenses/BSD-3-Clause',
  'https://paritytech.io/legal.html'
];

function isValidNavigationUrl (url) {
  return BLOCKSCOUT_URL_REGEXP.test(url) || ALLOWED_URLS.includes(url);
}

export default isValidNavigationUrl;
