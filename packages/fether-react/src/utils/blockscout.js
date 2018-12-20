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
    case 'rinkeby':
      chainNameBlockscout = chainName;
      baseUrl = `https://blockscout.com/eth/${chainNameBlockscout}`;
      break;
    default:
      console.error(
        'Chain name not yet supported. Please notify admin@parity.io'
      );
  }

  return baseUrl;
};

// Account URL
const ethUrl = (accountAddress, chainName) =>
  `${baseUrl(chainName)}/address/${accountAddress}/tokens`;

const tokenUrl = (accountAddress, chainName, tokenAddress) =>
  `${baseUrl(
    chainName
  )}/address/${accountAddress}/tokens/${tokenAddress}/token_transfers`;

const blockscoutAccountUrl = (accountAddress, chainName, tokenAddress) =>
  tokenAddress === 'ETH'
    ? ethUrl(accountAddress, chainName)
    : tokenUrl(accountAddress, chainName, tokenAddress);

// Tx URL
const ethTxUrl = (chainName, transactionHash) =>
  `${baseUrl(chainName)}/tx/${transactionHash}/internal_transactions`;

const tokenTxUrl = (chainName, transactionHash) =>
  `${baseUrl(chainName)}/tx/${transactionHash}/token_transfers`;

const blockscoutTxUrl = (chainName, transactionHash, tokenAddress) =>
  tokenAddress === 'ETH'
    ? ethTxUrl(chainName, transactionHash)
    : tokenTxUrl(chainName, transactionHash);

export { blockscoutAccountUrl, blockscoutTxUrl };
