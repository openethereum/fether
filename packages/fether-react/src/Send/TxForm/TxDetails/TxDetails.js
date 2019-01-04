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

  renderCalculation = () => {
    const { estimatedTxFee, values } = this.props;

    const gasPriceBn = new BigNumber(values.gasPrice.toString());
    const gasLimitBn = estimatedTxFee
      .div(gasPriceBn)
      .div(10 ** 9)
      .toFixed(0)
      .toString();

    return `Estimate amount of gas: ${gasLimitBn}`;
  };

  renderDetails = () => {
    return `${this.renderCalculation()}
${this.renderFee()}
${this.renderTotalAmount()}`;
  };

  renderFee = () => {
    const { estimatedTxFee } = this.props;

    return `Fee: ${fromWei(estimatedTxFee, 'ether')
      .toFixed(9)
      .toString()} ETH (estimate * gas price)`;
  };

  renderTotalAmount = () => {
    const { estimatedTxFee, token, values } = this.props;

    return `Total Amount: ${fromWei(
      estimatedTxFee.plus(
        token.address === 'ETH' ? toWei(values.amount.toString()) : 0
      ),
      'ether'
    ).toString()} ETH`;
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
    const { showDetails } = this.state;

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
              value={this.renderDetails()}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default TxDetails;
