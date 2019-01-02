// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import BigNumber from 'bignumber.js';
import { fromWei, toWei } from '@parity/api/lib/util/wei';

class TxDetails extends Component {
  state = {
    showDetails: false
  };

  renderCalculation = values => {
    const { estimatedTxFee } = this.props;

    const gasPriceBn = new BigNumber(values.gasPrice.toString());
    const gasLimitBn = estimatedTxFee(values)
      .div(gasPriceBn)
      .div(10 ** 9)
      .toFixed(0)
      .toString();

    return `Estimate amount of gas: ${gasLimitBn}`;
  };

  renderDetails = values => {
    return `${this.renderCalculation(values)}\n`
      .concat(`${this.renderFee(values)}\n`)
      .concat(`${this.renderTotalAmount(values)}`);
  };

  renderFee = values => {
    const { estimatedTxFee } = this.props;

    return `Fee: ${fromWei(estimatedTxFee(values), 'ether')
      .toFixed(9)
      .toString()} ETH (estimate * gas price)`;
  };

  renderTotalAmount = values => {
    const { estimatedTxFee, token } = this.props;

    return `Total Amount: ${fromWei(
      estimatedTxFee(values).plus(
        token.address === 'ETH' ? toWei(values.amount.toString()) : 0
      ),
      'ether'
    )
      .toFixed(10)
      .toString()} ETH`;
  };

  showDetailsAnchor = () => {
    return (
      <span className='details'>
        <a onClick={this.toggleDetails}>&darr; Details</a>
      </span>
    );
  };

  showHideAnchor = () => {
    return (
      <span className='details'>
        <a onClick={this.toggleDetails}>&uarr; Hide</a>
      </span>
    );
  };

  toggleDetails = () => {
    const { showDetails } = this.state;

    this.setState({ showDetails: !showDetails });
  };

  render () {
    const { isEstimatedTxFee, valid, values } = this.props;
    const { showDetails } = this.state;

    if (!valid || !isEstimatedTxFee(values) || isNaN(values.amount)) {
      return null;
    }

    return (
      <div>
        <div className='form_details_buttons'>
          {showDetails ? this.showHideAnchor() : this.showDetailsAnchor()}
        </div>
        <div className='form_field'>
          <div hidden={!showDetails}>
            <label htmlFor='txDetails'>Transaction Details (Estimate):</label>
            <textarea
              className='-sm-details'
              id='txDetails'
              readOnly
              value={this.renderDetails(values)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default TxDetails;
