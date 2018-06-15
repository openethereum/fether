// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import abi from '@parity/shared/lib/contracts/abi/eip20';
import { action, computed, observable } from 'mobx';
import { blockNumber$, makeContract$, post$ } from '@parity/light.js';
import { isAddress } from '@parity/api/lib/util/address';
import noop from 'lodash/noop';
import { toWei } from '@parity/api/lib/util/wei';

import parityStore from './parityStore';
import tokensStore from './tokensStore';

const DEFAULT_GAS = 21000; // Default gas amount to show

class SendStore {
  @observable blockNumber; // Current block number, used to calculate tx confirmations.
  @observable estimated = DEFAULT_GAS; // Estimated gas amount for this transaction.
  @observable tokenAddress; // 'ETH', or the token contract address
  @observable
  tx = {
    amount: 0.01, // In Ether or in token
    gasPrice: 4, // in Gwei
    to: '0x00Ae02834e91810B223E54ce3f9B7875258a1747'
  }; // The actual tx we are sending. No need to be observable.
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
    this.subscription = blockNumber$().subscribe(this.setBlockNumber);

    return this.api.signer.confirmRequest(this.requestId, null, password);
  };

  /**
   * Back to defaults.
   */
  clear = () => {
    this.tx.amount = 0;
    this.tx.to = '';
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
    if (this.tokenAddress === 'ETH') {
      // We only estimate txs to a correct address
      if (!this.tx || !isAddress(this.tx.to)) {
        return Promise.resolve(DEFAULT_GAS);
      }
      return this.api.eth
        .estimateGas(this.txForEth)
        .then(this.setEstimated)
        .catch(noop);
    } else {
      return this.contract.contractObject.instance.transfer
        .estimateGas(this.txForErc20.options, this.txForErc20.args)
        .then(this.setEstimated)
        .catch(noop);
    }
  };

  /**
   * Create a transaction.
   */
  send = () => {
    if (!this.tx) {
      console.error('Cannot send empty transaction.');
      return;
    }

    this.contract.transfer$('0x00Ae02834e91810B223E54ce3f9B7875258a1747', 12);
    const send$ =
      this.tokenAddress === 'ETH'
        ? post$(this.txForEth)
        : this.contract.transfer$(
          ...this.txForErc20.args,
          this.txForErc20.options
        );

    send$.subscribe(txStatus => {
      if (txStatus.requested) {
        this.requestId = txStatus.requested;
      }
      this.setTxStatus(txStatus);
    });
  };

  rejectRequest = () => {
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

  /**
   * This.tx is a user-friendly tx object. We convert it now as it can be
   * passed to post$(tx).
   */
  @computed
  get txForEth () {
    return {
      gasPrice: toWei(this.tx.gasPrice, 'shannon'), // shannon == gwei
      to: this.tx.to,
      value: toWei(this.tx.amount)
    };
  }

  /**
   * This.tx is a user-friendly tx object. We convert it now as it can be
   * passed to makeContract$(...).
   */
  @computed
  get txForErc20 () {
    return {
      args: [this.tx.to, this.tx.amount * 10 ** this.token.decimals],
      options: {
        gasPrice: toWei(this.tx.gasPrice, 'shannon') // shannon == gwei
      }
    };
  }

  @action
  setTokenAddress = tokenAddress => {
    this.tokenAddress = tokenAddress;
  };

  @action
  setTx = tx => {
    this.tx = tx;
  };

  @action
  setTxAmount = amount => {
    this.tx.amount = amount;
  };

  @action
  setTxGasPrice = gasPrice => {
    this.tx.gasPrice = gasPrice;
  };

  @action
  setTxTo = to => {
    this.tx.to = to;
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
