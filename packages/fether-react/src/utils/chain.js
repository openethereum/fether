// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

const isEtcChainId = currentChainIdBN => {
  return currentChainIdBN.valueOf() === '61';
};

const chainIdToString = currentChainIdBN => {
  return isEtcChainId(currentChainIdBN) ? 'ETC' : 'ETH';
};

const isNotErc20TokenAddress = tokenAddress => {
  return tokenAddress === 'ETH' || tokenAddress === 'ETC';
};

export { chainIdToString, isNotErc20TokenAddress, isEtcChainId };
