// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import { action, computed, observable } from 'mobx';
import { blockNumber$, post$ } from '@parity/light.js';
import { isAddress } from '@parity/api/lib/util/address';
import noop from 'lodash/noop';

import parityStore from './parityStore';
import tokensStore from './tokensStore';

const DEFAULT_GAS = 21000; // Default gas amount to show

class SendStore {
  @observable blockNumber; // Current block number, used to calculate confirmations.
  @observable estimated = DEFAULT_GAS; // Estimated gas amount for this transaction.
  tx; // The actual tx we are sending. No need to be observable.
  @observable txStatus; // Status of the tx, see wiki for details.

  constructor () {
    this.api = parityStore.api;
  }

  acceptRequest = password => {
    // Avoid calling this method from a random place
    if (!this.requestId) {
      return Promise.reject(
        new Error('The requestId has not been generated yet.')
      );
    }

    // Since we accepted this request, we also start to listen to blockNumber,
    // to calculate the number of confirmations
    blockNumber$().subscribe(this.setBlockNumber);

    return this.api.signer.confirmRequest(this.requestId, null, password);
  };

  /**
   * Get the number of confirmations our transaction has.
   */
  @computed
  get confirmations () {
    if (!this.txStatus.confirmed) {
      return -1;
    }
    return this.blockNumber - +this.txStatus.confirmed.blockNumber;
  }

  /**
   * Estimate the amount of gas for a particular transaction. Note: at the time
   * we're estimating, this.tx has not been set yet (only set at postTx stage),
   * that's why we're not using this.tx here, but a tx passed as argument.
   */
  estimateGas = tx => {
    // We only estimate txs to a correct address
    if (!tx || !isAddress(tx.to)) {
      return Promise.resolve(DEFAULT_GAS);
    }
    return this.api.eth
      .estimateGas(tx)
      .then(this.setEstimated)
      .catch(noop);
  };

  /**
   * Create a transaction.
   */
  postTx = tx => {
    if (!tx) {
      return;
    }
    this.setTx(tx);

    // Subscribe to this transaction's status
    post$(tx).subscribe(txStatus => {
      if (txStatus.requested) {
        this.requestId = txStatus.requested;
      }
      this.setTxStatus(txStatus);
    });
  };

  rejectRequest = (requestId, password) => {
    // Avoid calling this method from a random place
    if (!this.requestId) {
      return Promise.reject(
        new Error('The requestId has not been generated yet.')
      );
    }
    return this.api.signer.rejectRequest(this.requestId);
  };

  @computed
  get token () {
    return tokensStore.tokens.get(this.tokenAddress);
  }

  setTokenAddress = tokenAddress => {
    this.tokenAddress = tokenAddress;
  };

  setTx = tx => {
    this.tx = tx;
  };

  @action
  setBlockNumber = blockNumber => {
    this.blockNumber = blockNumber;
  };

  @action
  setEstimated = estimated => {
    // Since estimateGas is not always accurate, we add a 120% factor for buffer.
    const GAS_MULT_FACTOR = 1.2;

    this.estimated = +estimated * GAS_MULT_FACTOR; // Don't store as BigNumber
  };

  @action
  setTxStatus = txStatus => {
    this.txStatus = txStatus;
  };
}

export default new SendStore();
