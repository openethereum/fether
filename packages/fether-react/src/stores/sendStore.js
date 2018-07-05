// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import abi from '@parity/shared/lib/contracts/abi/eip20';
import { action, computed, observable } from 'mobx';
import { BigNumber } from 'bignumber.js';
import { blockNumber$, makeContract$, post$ } from '@parity/light.js';

import Debug from '../utils/debug';
import parityStore from './parityStore';
import { txForErc20, txForEth } from '../utils/estimateGas';

const debug = Debug('sendStore');
const GAS_MULT_FACTOR = 1.25; // Since estimateGas is not always accurate, we add a 33% factor for buffer.
const DEFAULT_GAS = new BigNumber(21000 * GAS_MULT_FACTOR); // Default gas amount

export class SendStore {
  @observable blockNumber; // Current block number, used to calculate tx confirmations.
  @observable estimated = DEFAULT_GAS; // Estimated gas amount for this transaction.
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
   * Create a transaction.
   */
  send = (token, password) => {
    const send$ =
      token.address === 'ETH'
        ? post$(txForEth(this.tx))
        : this.contract.transfer$(
          ...txForErc20(this.tx, token).args,
          txForErc20(this.tx, token).options
        );

    debug(
      'Sending tx.',
      token.address === 'ETH' ? this.txForEth : this.txForErc20
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
  setTx = tx => {
    this.tx = tx;
  };

  @action
  setTxStatus = txStatus => {
    this.txStatus = txStatus;
  };
}

export default new SendStore();
