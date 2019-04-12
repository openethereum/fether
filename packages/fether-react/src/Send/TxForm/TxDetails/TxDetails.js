// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import BigNumber from 'bignumber.js';
import { fromWei, toWei } from '@parity/api/lib/util/wei';

import { chainIdToString, isNotErc20TokenAddress } from '../../../utils/chain';

class TxDetails extends Component {
  renderDetails = () => {
    const { estimatedTxFee, token, values } = this.props;

    if (
      !estimatedTxFee ||
      !values.gasPrice ||
      !values.amount ||
      !values.chainId ||
      !values.ethBalance ||
      !values.gas ||
      !values.gasPrice ||
      !values.transactionCount ||
      !token.address
    ) {
      // Keep line break so message is centered
      return `
Missing input fields...`;
    }

    return `${this.renderCalculation()}
${this.renderFee()}
${this.renderTotalAmount()}`;
  };

  renderCalculation = () => {
    const { estimatedTxFee, values } = this.props;

    if (!estimatedTxFee || !values.gasPrice) {
      return;
    }

    const gasPriceBn = new BigNumber(values.gasPrice.toString());
    const gasLimitBn = estimatedTxFee
      .div(gasPriceBn)
      .div(10 ** 9)
      .toFixed(0)
      .toString();

    return `Gas Limit: ${gasLimitBn}`;
  };

  renderFee = () => {
    const { estimatedTxFee, values } = this.props;
    const currentChainIdBN = values.chainId;

    if (!estimatedTxFee) {
      return;
    }

    return `Fee: ${fromWei(estimatedTxFee, 'ether')
      .toFixed(9)
      .toString()} ${chainIdToString(
      currentChainIdBN
    )} (gas limit * gas price)`;
  };

  renderTotalAmount = () => {
    const { estimatedTxFee, token, values } = this.props;
    const currentChainIdBN = values.chainId;

    if (!estimatedTxFee || !values.amount || !token.address) {
      return;
    }

    return `Total Amount: ${fromWei(
      estimatedTxFee.plus(
        isNotErc20TokenAddress(token.address)
          ? toWei(values.amount.toString())
          : 0
      ),
      'ether'
    ).toString()} ${chainIdToString(currentChainIdBN)}`;
  };

  render () {
    const { showDetails } = this.props;

    return (
      <div>
        <div className='form_field'>
          <div hidden={!showDetails}>
            <label htmlFor='txDetails'>Transaction Details:</label>
            <textarea
              className='-sm-details'
              id='txDetails'
              readOnly
              value={this.renderDetails()}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default TxDetails;
