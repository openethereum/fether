// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import { action, computed, observable } from 'mobx';
import { blockNumber$, post$ } from '@parity/light.js';

import parityStore from './parityStore';
import tokensStore from './tokensStore';

class SendStore {
  @observable blockNumber; // Current block number, used to calculate
  @observable txStatus; // Status of the tx, see wiki for details

  constructor () {
    this.api = parityStore.api;
  }

  acceptRequest = password => {
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

  @computed
  get confirmations () {
    if (!this.txStatus.confirmed) {
      return -1;
    }
    return this.blockNumber - +this.txStatus.confirmed.blockNumber;
  }

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
    if (!this.requestId) {
      return Promise.reject(
        new Error('The requestId has not been generated yet.')
      );
    }
    return this.api.signer.rejectRequest(this.requestId);
  };

  setTokenFromAddress = tokenAddress => {
    this.token = tokensStore.tokens.get(tokenAddress);
  };

  setTx = tx => {
    this.tx = tx;
  };

  @action
  setBlockNumber = blockNumber => {
    this.blockNumber = blockNumber;
  };

  @action
  setTxStatus = txStatus => {
    this.txStatus = txStatus;
  };
}

export default new SendStore();
