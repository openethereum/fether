// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import UrlPattern from 'url-pattern';

import { SECURITY_OPTIONS } from '../options/config';

const { TRUSTED_HOSTS } = SECURITY_OPTIONS.fetherNetwork;

// Github
const GITHUB_TRUSTED_HOSTS = TRUSTED_HOSTS.github;

// Blockscout - Only includes those that are available on the Blockscout website
const BLOCKSCOUT_TRUSTED_HOSTS = TRUSTED_HOSTS.blockscout;
const BLOCKSCOUT_CHAINS_SUPPORTED = ['eth', 'etc', 'poa'];
const BLOCKSCOUT_NETWORKS_SUPPORTED = [
  'mainnet',
  'classic',
  'ropsten',
  'kovan',
  'goerli',
  'core',
  'dai',
  'sokol',
  'rinkeby'
];
const BLOCKSCOUT_HASH_KINDS = ['tx', 'address'];
const BLOCKSCOUT_HASH_TRAILERS = [
  'coin_balances',
  'internal_transactions',
  'tokens',
  'transactions'
];
const HASH_ADDRESS_LENGTH = 40;
const HASH_TX_LENGTH = 64;

// Url Patterns
const GENERAL_PATTERN = new UrlPattern(
  '(https\\://)(:subdomain.):domain.:tld(\\::port)(/*)'
);
const GITHUB_PATTERN_1 = new UrlPattern(
  '(https\\://)(:subdomain.):domain.:tld(/)(*)(.png|.jpg)'
);
const GITHUB_PATTERN_2 = new UrlPattern(
  '(https\\://)(:subdomain.):domain.:tld(/)atomiclabs/cryptocurrency-icons/(*)(.png|.jpg)'
);
const GITHUB_PATTERN_3 = new UrlPattern(
  '(https\\://)(:subdomain.):domain.:tld(/)ethcore/(*)(.png|.jpg)'
);
const BLOCKSCOUT_PATTERN = new UrlPattern(
  '(https\\://)(:subdomain.):domain.:tld(/):chain(/):network(/):hashKind(/0x):hash(/:hashTrailer)'
);

function isValidGithubUrl (url) {
  const match =
    GITHUB_PATTERN_1.match(url) ||
    GITHUB_PATTERN_2.match(url) ||
    GITHUB_PATTERN_3.match(url);

  if (!match) {
    return false;
  }

  return true;
}

function isValidBlockscoutUrl (url) {
  const match = BLOCKSCOUT_PATTERN.match(url);

  if (!match) {
    return false;
  }

  if (
    BLOCKSCOUT_CHAINS_SUPPORTED.includes(match.chain) &&
    BLOCKSCOUT_NETWORKS_SUPPORTED.includes(match.network) &&
    BLOCKSCOUT_HASH_KINDS.includes(match.hashKind) &&
    [HASH_ADDRESS_LENGTH, HASH_TX_LENGTH].includes(match.hash.length) &&
    BLOCKSCOUT_HASH_TRAILERS.includes(match.hashTrailer)
  ) {
    return true;
  }

  return false;
}

/**
 * List of trusted subdomains, domain extensions, and ports, as relevant.
 * Detect trusted prefix and then call method to validate it.
 */
function isValidUrl (url) {
  const match = GENERAL_PATTERN.match(url);

  if (!match) {
    return false;
  }

  if (!url.startsWith('https')) {
    return false;
  }

  // Blockscout URL
  if (
    BLOCKSCOUT_TRUSTED_HOSTS.includes(
      (match.subdomain && match.subdomain) +
        (match.subdomain && '.') +
        (match.domain && match.domain) +
        (match.domain && '.') +
        (match.tld && match.tld)
    ) ||
    BLOCKSCOUT_TRUSTED_HOSTS.includes(
      (match.domain && match.domain) +
        (match.domain && '.') +
        (match.tld && match.tld)
    )
  ) {
    return isValidBlockscoutUrl(url);
  }

  // Github URL
  if (
    GITHUB_TRUSTED_HOSTS.includes(
      (match.subdomain && match.subdomain) +
        (match.subdomain && '.') +
        (match.domain && match.domain) +
        (match.domain && '.') +
        (match.tld && match.tld)
    ) ||
    GITHUB_TRUSTED_HOSTS.includes(
      (match.domain && match.domain) +
        (match.domain && '.') +
        (match.tld && match.tld)
    )
  ) {
    return isValidGithubUrl(url);
  }
}

export default isValidUrl;
