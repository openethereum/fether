// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import BigNumber from 'bignumber.js';
import { fromWei, toWei } from '@parity/api/lib/util/wei';

import i18n from '../../../i18n';

class TxDetails extends Component {
  renderDetails = () => {
    const { estimatedTxFee, token, values } = this.props;

    if (
      !estimatedTxFee ||
      !values.gasPrice ||
      !values.amount ||
      !token.address
    ) {
      // Keep line break so message is centered
      return `
${i18n.t('ns1:tx.form.details.missing_fields')}`;
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

    return i18n.t('ns1:tx.form.details.gas_limit', { gas_limit: gasLimitBn });
  };

  renderFee = () => {
    const { estimatedTxFee } = this.props;

    if (!estimatedTxFee) {
      return;
    }

    const fee = `${fromWei(estimatedTxFee, 'ether')
      .toFixed(9)
      .toString()}`;

    return i18n.t('ns1:tx.form.details.fee', { fee });
  };

  renderTotalAmount = () => {
    const { estimatedTxFee, token, values } = this.props;

    if (!estimatedTxFee || !values.amount || !token.address) {
      return;
    }

    const totalAmount = `${fromWei(
      estimatedTxFee.plus(
        token.address === 'ETH' ? toWei(values.amount.toString()) : 0
      ),
      'ether'
    ).toString()}`;

    return i18n.t('ns1:tx.form.details.total_amount', {
      total_amount: totalAmount
    });
  };

  render () {
    const { showDetails } = this.props;

    return (
      <div>
        <div className='form_field'>
          <div hidden={!showDetails}>
            <label htmlFor='txDetails'>
              {i18n.t('ns1:tx.form.details.title')}
            </label>
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
