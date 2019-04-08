// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { isNotErc20TokenAddress } from './chain';

const baseUrlForChain = chainName => {
  let baseUrl;

  let chainNameBlockscout = '';

  switch (chainName) {
    case 'foundation':
      chainNameBlockscout = 'mainnet';
      baseUrl = `https://blockscout.com/eth/${chainNameBlockscout}`;
      break;
    case 'classic':
      chainNameBlockscout = 'mainnet';
      baseUrl = `https://blockscout.com/etc/${chainNameBlockscout}`;
      break;
    case 'kovan':
    case 'ropsten':
      chainNameBlockscout = chainName;
      baseUrl = `https://blockscout.com/eth/${chainNameBlockscout}`;
      break;
    default:
      console.error(
        'Chain name not yet supported. Please open a Github issue at https://github.com/paritytech/fether/issues/new'
      );
  }

  return baseUrl;
};

// Tx URL for ETH or ETC
const ethTxUrl = (chainName, transactionHash) =>
  `${baseUrlForChain(chainName)}/tx/${transactionHash}/internal_transactions`;

const tokenTxUrl = (chainName, transactionHash) =>
  `${baseUrlForChain(chainName)}/tx/${transactionHash}/token_transfers`;

const blockscoutTxUrl = (chainName, transactionHash, tokenAddress) =>
  isNotErc20TokenAddress(tokenAddress)
    ? ethTxUrl(chainName, transactionHash)
    : tokenTxUrl(chainName, transactionHash);

export { blockscoutTxUrl };
