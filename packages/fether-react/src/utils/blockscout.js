// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

const baseUrl = chainName => {
  let baseUrl;

  let chainNameBlockscout = '';

  switch (chainName) {
    case 'foundation':
      chainNameBlockscout = 'mainnet';
      baseUrl = `https://blockscout.com/eth/${chainNameBlockscout}`;
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

// Tx URL
const ethTxUrl = (chainName, transactionHash) =>
  `${baseUrl(chainName)}/tx/${transactionHash}/internal_transactions`;

const tokenTxUrl = (chainName, transactionHash) =>
  `${baseUrl(chainName)}/tx/${transactionHash}/token_transfers`;

const blockscoutTxUrl = (chainName, transactionHash, tokenAddress) =>
  tokenAddress === 'ETH'
    ? ethTxUrl(chainName, transactionHash)
    : tokenTxUrl(chainName, transactionHash);

export { blockscoutTxUrl };
