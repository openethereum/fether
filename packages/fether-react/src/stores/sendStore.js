// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { action, computed, observable } from 'mobx';
import { blockNumber$, post$, postRaw$ } from '@parity/light.js';

import {
  contractForToken,
  txForErc20,
  txForEth,
  transactionToRlp,
  signTransactionWithSignature
} from '../utils/transaction';
import Debug from '../utils/debug';
import parityStore from './parityStore';

const debug = Debug('sendStore');

export class SendStore {
  @observable
  blockNumber; // Current block number, used to calculate tx confirmations.
  tx = {}; // The actual tx we are sending. No need to be observable.
  @observable
  txStatus; // Status of the tx, see wiki for details.

  listenForConfirmations = () => {
    this.subscription = blockNumber$().subscribe(this.setBlockNumber);
  };

  acceptRequest = (requestId, password) => {
    // Since we accepted this request, we also start to listen to blockNumber,
    // to calculate the number of confirmations
    this.listenForConfirmations();

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
   * Send a transaction.
   */
  send = password => {
    const { token } = this.tx;

    const tx =
      token.address === 'ETH' ? txForEth(this.tx) : txForErc20(this.tx, token);
    const send$ =
      token.address === 'ETH'
        ? post$(tx)
        : contractForToken(token.address).transfer$(...tx.args, tx.options);

    debug('Sending tx.', tx);

    return new Promise((resolve, reject) => {
      send$.subscribe(txStatus => {
        this.setTxStatus(txStatus);
        // When we arrive to the `requested` stage, we accept the request
        if (txStatus.requested) {
          this.acceptRequest(txStatus.requested, password)
            .then(resolve)
            .catch(reject);
        }
        debug('Tx status updated.', txStatus);
      }, reject);
    });
  };

  /**
   * Send a raw, signed transaction.
   */
  sendRaw = () => {
    debug('Sending raw tx.', this.tx.rawSigned);

    return new Promise((resolve, reject) => {
      postRaw$(this.tx.rawSigned).subscribe(txStatus => {
        this.setTxStatus(txStatus);
        if (txStatus.signed) {
          this.listenForConfirmations();
          resolve();
        }
        debug('Tx status updated.', txStatus);
      }, reject);
    });
  };

  /**
   * Get the RLP of an (unsigned) transaction.
   */
  getRlp = () => {
    return transactionToRlp(this.tx);
  };

  /**
   * Sign the transaction with the given signature.
   */
  @action
  signRaw = signature => {
    const signed = signTransactionWithSignature(this.tx, signature);

    this.tx.rawSigned = '0x' + signed.toString('hex');
  };

  @action
  setBlockNumber = blockNumber => {
    this.blockNumber = blockNumber;
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
