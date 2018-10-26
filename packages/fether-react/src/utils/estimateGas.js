// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import abi from '@parity/contracts/lib/abi/eip20';
import BigNumber from 'bignumber.js';
import { makeContract } from '@parity/light.js';
import memoize from 'lodash/memoize';
import { toWei } from '@parity/api/lib/util/wei';

import Debug from './debug';

const debug = Debug('estimateGas');
const GAS_MULT_FACTOR = 1.25; // Since estimateGas is not always accurate, we add a 33% factor for buffer.

export const contractForToken = memoize(tokenAddress =>
  makeContract(tokenAddress, abi)
);

/**
 * Estimate the amount of gas for our transaction.
 */
export const estimateGas = (tx, token, api) => {
  if (!tx || !Object.keys(tx).length) {
    return Promise.reject(new Error('Tx not set.'));
  }

  if (token.address === 'ETH') {
    return estimateGasForEth(txForEth(tx), api).then(addBuffer);
  } else {
    return estimateGasForErc20(txForErc20(tx, token), token).then(addBuffer);
  }
};

/**
 * Estimate gas to transfer in ERC20 contract. Expensive function, so we
 * memoize it.
 */
const estimateGasForErc20 = memoize((txForErc20, token) => {
  debug(`Estimating gas for tx on token contract.`, token, txForErc20);
  return contractForToken(
    token.address
  ).contractObject.instance.transfer.estimateGas(
    txForErc20.options,
    txForErc20.args
  );
}, JSON.stringify);

/**
 * Estimate gas to transfer to an ETH address. Expensive function, so we
 * memoize it.
 */
const estimateGasForEth = memoize((txForEth, api) => {
  debug(`Estimating gas for tx.`, txForEth);
  return api.eth.estimateGas(txForEth);
}, JSON.stringify);

/**
 * Add some extra gas buffer just to be sure user has enough balance.
 *
 * @param {BigNumber} estimated - The estimated gas price returned by
 * estimateGas.
 */
const addBuffer = estimated => {
  const withBuffer = estimated.mul(GAS_MULT_FACTOR);
  debug(`Estimated gas ${+estimated}, with buffer ${+withBuffer}.`);
  return withBuffer;
};

/**
 * This.tx is a user-friendly tx object. We convert it now as it can be
 * passed to makeContract.transfer(...).
 */
export const txForErc20 = (tx, token) => {
  return {
    args: [
      tx.to,
      new BigNumber(tx.amount).mul(new BigNumber(10).pow(token.decimals))
    ],
    options: {
      from: tx.from,
      gasPrice: toWei(tx.gasPrice, 'shannon') // shannon == gwei
    }
  };
};

/**
 * This.tx is a user-friendly tx object. We convert it now as it can be
 * passed to post$(tx).
 */
export const txForEth = tx => {
  return {
    from: tx.from,
    gasPrice: toWei(tx.gasPrice, 'shannon'), // shannon == gwei
    to: tx.to,
    value: toWei(tx.amount.toString())
  };
};
