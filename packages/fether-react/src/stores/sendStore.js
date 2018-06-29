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
import { toWei } from '@parity/api/lib/util/wei';

import Debug from '../utils/debug';
import parityStore from './parityStore';
import tokensStore from './tokensStore';

const debug = logger()('sendStore');
const DEFAULT_GAS = new BigNumber(21000); // Default gas amount to show
const GAS_MULT_FACTOR = 1.33; // Since estimateGas is not always accurate, we add a 33% factor for buffer.

class SendStore {
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
    if (this.tokenAddress === 'ETH') {
      return this.estimateGasForEth(this.txForEth);
    } else {
      return this.estimateGasForErc20(this.txForErc20);
    }
  };

  /**
   * Estimate gas to transfer in ERC20 contract. Expensive function, so we
   * memoize it.
   */
  estimateGasForErc20 = memoize(txForErc20 => {
    return this.contract.contractObject.instance.transfer
      .estimateGas(txForErc20.options, txForErc20.args)
      .then(this.setEstimated)
      .catch(noop);
  }, JSON.stringify);

  /**
   * Estimate gas to transfer to an ETH address. Expensive function, so we
   * memoize it.
   */
  estimateGasForEth = memoize(txForEth => {
    return parityStore.api.eth
      .estimateGas(txForEth)
      .then(this.setEstimated)
      .catch(noop);
  }, JSON.stringify);

  /**
   * Create a transaction.
   */
  send = password => {
    const send$ =
      this.tokenAddress === 'ETH'
        ? post$(this.txForEth)
        : this.contract.transfer$(
          ...this.txForErc20.args,
          this.txForErc20.options
        );

    logger()(
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
        logger()('Tx status updated.', txStatus);
      });
    });
  };

  @computed
  get token () {
    return tokensStore.tokens[this.tokenAddress];
  }

  /**
   * This.tx is a user-friendly tx object. We convert it now as it can be
   * passed to makeContract$(...).
   */
  @computed
  get txForErc20 () {
    return {
      args: [
        this.tx.to,
        new BigNumber(this.tx.amount).mul(
          new BigNumber(10).pow(this.token.decimals)
        )
      ],
      options: {
        gasPrice: toWei(this.tx.gasPrice, 'shannon') // shannon == gwei
      }
    };
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
      value: toWei(this.tx.amount.toString())
    };
  }

  @action
  setBlockNumber = blockNumber => {
    this.blockNumber = blockNumber;
  };

  @action
  setEstimated = estimated => {
    this.estimated = estimated.mul(GAS_MULT_FACTOR);
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
