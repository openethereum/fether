// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import abi from '@parity/shared/lib/contracts/abi/eip20';
import { action, computed, observable } from 'mobx';
import { BigNumber } from 'bignumber.js';
import { blockNumber$, makeContract$, post$ } from '@parity/light.js';
import memoize from 'lodash/memoize';
import noop from 'lodash/noop';

import Debug from '../utils/debug';
import parityStore from './parityStore';
import tokensStore from './tokensStore';
import { txForErc20, txForEth } from '../utils/estimateGas';

const debug = Debug('sendStore');
const GAS_MULT_FACTOR = 1.25; // Since estimateGas is not always accurate, we add a 33% factor for buffer.
const DEFAULT_GAS = new BigNumber(21000 * GAS_MULT_FACTOR); // Default gas amount

export class SendStore {
  @observable blockNumber; // Current block number, used to calculate tx confirmations.
  @observable estimated = DEFAULT_GAS; // Estimated gas amount for this transaction.
  @observable tokenAddress; // 'ETH', or the token contract address
  tx = {}; // The actual tx we are sending. No need to be observable.
  @observable txStatus; // Status of the tx, see wiki for details.

  acceptRequest = (requestId, password) => {
    // Since we accepted this request, we also start to listen to blockNumber,
    // to calculate the number of confirmations
    this.subscription = blockNumber$().subscribe(this.setBlockNumber);

    return parityStore.api.signer.confirmRequest(requestId, null, password);
  };

  /**
   * Back to defaults.
   */
  clear = () => {
    this.tx = {};
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  };

  /**
   * Get the number of confirmations our transaction has.
   */
  @computed
  get confirmations () {
    if (!this.txStatus || !this.txStatus.confirmed) {
      return -1;
    }
    return this.blockNumber - +this.txStatus.confirmed.blockNumber;
  }

  /**
   * If it's a token, then return the makeContract$ object.
   */
  @computed
  get contract () {
    if (this.tokenAddress === 'ETH') {
      return null;
    }
    return makeContract$(this.tokenAddress, abi);
  }

  /**
   * Estimate the amount of gas for our transaction.
   */
  estimateGas = () => {
    if (!this.tx || !Object.keys(this.tx).length) {
      return Promise.reject(new Error('Tx not set in sendStore.'));
    }

    if (this.tokenAddress === 'ETH') {
      return this.estimateGasForEth(txForEth(this.tx));
    } else {
      return this.estimateGasForErc20(
        txForErc20(this.tx, tokensStore.tokens[this.tokenAddress])
      );
    }
  };

  /**
   * Estimate gas to transfer in ERC20 contract. Expensive function, so we
   * memoize it.
   */
  estimateGasForErc20 = memoize(
    txForErc20 =>
      this.contract.contractObject.instance.transfer
        .estimateGas(txForErc20.options, txForErc20.args)
        .then(this.setEstimated)
        .catch(noop),
    JSON.stringify
  );

  /**
   * Estimate gas to transfer to an ETH address. Expensive function, so we
   * memoize it.
   */
  estimateGasForEth = memoize(
    txForEth =>
      parityStore.api.eth
        .estimateGas(txForEth)
        .then(this.setEstimated)
        .catch(noop),
    JSON.stringify
  );

  /**
   * Create a transaction.
   */
  send = password => {
    const send$ =
      this.tokenAddress === 'ETH'
        ? post$(txForEth(this.tx))
        : this.contract.transfer$(
          ...txForErc20(this.tx).args,
          txForErc20(this.tx).options
        );

    debug(
      'Sending tx.',
      this.tokenAddress === 'ETH' ? this.txForEth : this.txForErc20
    );

    return new Promise((resolve, reject) => {
      send$.subscribe(txStatus => {
        // When we arrive to the `requested` stage, we accept the request
        if (txStatus.requested) {
          this.acceptRequest(txStatus.requested, password)
            .then(resolve)
            .catch(reject);
        }
        this.setTxStatus(txStatus);
        debug('Tx status updated.', txStatus);
      });
    });
  };

  @action
  setBlockNumber = blockNumber => {
    this.blockNumber = blockNumber;
  };

  @action
  setEstimated = estimated => {
    this.estimated = estimated.mul(GAS_MULT_FACTOR);
    debug('Estimated gas,', +estimated, ', with buffer,', +this.estimated);
  };

  @action
  setTokenAddress = tokenAddress => {
    this.tokenAddress = tokenAddress;
  };

  @action
  setTx = tx => {
    this.tx = tx;
  };

  @action
  setTxStatus = txStatus => {
    this.txStatus = txStatus;
  };
}

export default new SendStore();
