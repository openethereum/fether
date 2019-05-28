// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import BigNumber from 'bignumber.js';
import { fromWei, toWei } from '@parity/api/lib/util/wei';

import i18n, { packageNS } from '../../../i18n';
import { chainIdToString, isNotErc20TokenAddress } from '../../../utils/chain';

class TxDetails extends Component {
  renderDetails = () => {
    const { estimatedTxFee, token, values } = this.props;

    if (
      !estimatedTxFee ||
      !values.gasPrice ||
      // Allow estimating tx fee when the amount is zero
      // !values.amount ||
      !values.chainId ||
      !values.ethBalance ||
      !values.gas ||
      !values.gasPrice ||
      !values.transactionCount ||
      !token.address
    ) {
      // Keep line break so message is centered
      return `
${i18n.t(`${packageNS}:tx.form.details.missing_fields`)}`;
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

    // Temporarily solution since Fether has to have the simplest UI
    // a Gas Price form field may be too overwhelming for beginner users
    // but advanced users may want to send data that may require a
    // higher Gas Limit. On
    if (values.data) {
      return i18n.t(`${packageNS}:tx.form.details.gas_limit`, {
        gas_limit: new BigNumber(200000)
      });
    }

    const gasLimitBn = estimatedTxFee
      .div(gasPriceBn)
      .div(10 ** 9)
      .toFixed(0)
      .toString();

    return i18n.t(`${packageNS}:tx.form.details.gas_limit`, {
      gas_limit: gasLimitBn
    });
  };

  renderFee = () => {
    const { estimatedTxFee, values } = this.props;
    const currentChainIdBN = values.chainId;

    if (!estimatedTxFee) {
      return;
    }

    const fee = `${fromWei(estimatedTxFee, 'ether')
      .toFixed(9)
      .toString()}`;

    return i18n.t(`${packageNS}:tx.form.details.fee`, {
      chain_id: chainIdToString(currentChainIdBN),
      fee
    });
  };

  renderTotalAmount = () => {
    const { estimatedTxFee, token, values } = this.props;
    const currentChainIdBN = values.chainId;

    if (!estimatedTxFee || !token.address) {
      return;
    }

    const totalAmount = `${fromWei(
      estimatedTxFee.plus(
        isNotErc20TokenAddress(token.address)
          ? values.amount && toWei(values.amount.toString())
          : 0
      ),
      'ether'
    ).toString()}`;

    return i18n.t(`${packageNS}:tx.form.details.total_amount`, {
      chain_id: chainIdToString(currentChainIdBN),
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
              {i18n.t(`${packageNS}:tx.form.details.title`)}
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
