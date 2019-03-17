// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import i18n from '../i18n';

const baseUrlForChain = chainName => {
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
      console.error(i18n.t('ns1:utils.blockscout_chain'));
  }

  return baseUrl;
};

// Tx URL
const ethTxUrl = (chainName, transactionHash) =>
  `${baseUrlForChain(chainName)}/tx/${transactionHash}/internal_transactions`;

const tokenTxUrl = (chainName, transactionHash) =>
  `${baseUrlForChain(chainName)}/tx/${transactionHash}/token_transfers`;

const blockscoutTxUrl = (chainName, transactionHash, tokenAddress) =>
  tokenAddress === 'ETH'
    ? ethTxUrl(chainName, transactionHash)
    : tokenTxUrl(chainName, transactionHash);

export { blockscoutTxUrl };
