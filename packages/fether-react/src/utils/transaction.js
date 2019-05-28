// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import abi from '@parity/contracts/lib/abi/eip20';
import Abi from '@parity/abi';
import Token from '@parity/abi/lib/token';
import { eip20 } from '@parity/contracts/lib/abi';
import BigNumber from 'bignumber.js';
import { makeContract } from '@parity/light.js';
import memoize from 'lodash/memoize';
import { toWei } from '@parity/api/lib/util/wei';

import { isNotErc20TokenAddress } from './chain';
import Debug from './debug';
import EthereumTx from 'ethereumjs-tx';

const debug = Debug('transaction');
const GAS_MULT_FACTOR = 1.25; // Since estimateGas is not always accurate, we add a 25% factor for buffer.

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

  if (isNotErc20TokenAddress(token.address)) {
    return estimateGasForEth(txForEth(tx), api).then(estimatedGasForEth => {
      // do not add any buffer in case of an account to account transaction
      return estimatedGasForEth.eq(21000)
        ? estimatedGasForEth
        : addBuffer(estimatedGasForEth);
    });
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
 * Estimate gas to transfer to an ETH or ETC address. Expensive function, so we
 * memoize it. Note that you must only transfer from and ETH to an ETH address,
 * or from an ETC to an ETC address.
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
  // Add a buffer to the estimated gas, and round the number
  const withBuffer = estimated.multipliedBy(GAS_MULT_FACTOR).decimalPlaces(0);
  debug(`Estimated gas ${+estimated}, with buffer ${+withBuffer}.`);
  return withBuffer;
};

/**
 * This.tx is a user-friendly tx object. We convert it now as it can be
 * passed to makeContract.transfer(...).
 */
export const txForErc20 = (tx, token) => {
  const output = {
    args: [
      tx.to,
      new BigNumber(tx.amount).multipliedBy(
        new BigNumber(10).pow(token.decimals)
      )
    ],
    options: {
      data: tx.data,
      from: tx.from,
      gasPrice: toWei(tx.gasPrice, 'shannon') // shannon == gwei
    }
  };

  if (tx.gas) {
    output.options.gas = tx.gas;
  }

  return output;
};

/**
 * This.tx is a user-friendly tx object. We convert it now as it can be
 * passed to post$(tx).
 */
export const txForEth = tx => {
  const output = {
    data: tx.data,
    from: tx.from,
    gasPrice: toWei(tx.gasPrice, 'shannon'), // shannon == gwei
    to: tx.to,
    value: toWei(tx.amount.toString())
  };
  // gas field should not be present when the function is called for gas estimation.
  if (tx.gas) {
    output.gas = tx.gas;
  }
  return output;
};

/**
 * This.tx is a user-friendly tx object. This function converts it to an
 * EthereumTx object.
 */
const getEthereumTx = tx => {
  const {
    amount,
    chainId,
    data,
    gas,
    gasPrice,
    to,
    token,
    transactionCount
  } = tx;

  const txParams = {
    nonce: '0x' + transactionCount.toNumber().toString(16),
    gasLimit: '0x' + gas.toNumber().toString(16),
    gasPrice: toWei(gasPrice, 'shannon').toNumber(),
    chainId
  };

  if (isNotErc20TokenAddress(token.address)) {
    txParams.data = data;
    txParams.to = to;
    txParams.value = parseFloat(amount) * Math.pow(10, 18);
  } else {
    txParams.to = token.address;
    txParams.data = txParams.data
      ? data
      : '0x' +
        new Abi(eip20).functions
          .find(f => f._name === 'transfer')
          .encodeCall([
            new Token('address', to),
            new Token(
              'uint',
              '0x' +
                new BigNumber(amount)
                  .multipliedBy(new BigNumber(10).pow(token.decimals))
                  .toNumber()
                  .toString(16)
            )
          ]);
  }

  return new EthereumTx(txParams);
};

/*
 * Sign the given this.tx with the given signature.
 *
 * ethereumjs-tx does not support EIP155-compliant signatures (https://git.io/fh3SG)
 * This is a workaround from https://git.io/fh3S8
 */
export const signTransactionWithSignature = (thisTx, signature) => {
  const tx = getEthereumTx(thisTx);

  const sigBuf = Buffer.from(signature.substr(2), 'hex');

  // Mimicking the way tx.sign() works
  let v = sigBuf[64] + 27;

  if (tx._chainId > 0) {
    v += tx._chainId * 2 + 8;
  }

  tx.r = sigBuf.slice(0, 32);
  tx.s = sigBuf.slice(32, 64);
  tx.v = Buffer.from([v]);

  return tx.serialize();
};

/*
 * Return the RLP of the given this.tx.
 *
 * From https://git.io/fh3Sd
 */
export const transactionToRlp = thisTx => {
  const tx = getEthereumTx(thisTx);

  const { v, r, s } = tx;

  // Poor man's serialize without signature.
  tx.v = Buffer.from([tx._chainId]);
  tx.r = Buffer.from([0]);
  tx.s = Buffer.from([0]);

  const rlp = '0x' + tx.serialize().toString('hex');

  // Restore previous values
  tx.v = v;
  tx.r = r;
  tx.s = s;

  return rlp;
};
