// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import BigNumber from 'bignumber.js';
import { fromWei, toWei } from '@parity/api/lib/util/wei';
import styled from 'styled-components';

import {
  DivTxFormStyles,
  LabelTextareaTxDetailsStyles,
  TextareaTxDetailsStyles
} from './style';

const DivTxForm = styled.div`
  ${DivTxFormStyles};
`;

const LabelTextareaTxDetails = styled.label`
  ${LabelTextareaTxDetailsStyles};
`;

const TextareaTxDetails = styled.textarea`
  ${TextareaTxDetailsStyles};
`;

class TxDetails extends Component {
  renderDetails = () => {
    const { estimatedTxFee } = this.props;

    return estimatedTxFee
      ? `${this.renderCalculation()}
${this.renderFee()}
${this.renderTotalAmount()}`
      : `
Missing input fields...`;
  };

  renderCalculation = () => {
    const { estimatedTxFee, values } = this.props;
    const gasPriceBn = new BigNumber(values.gasPrice.toString());
    const gasLimitBn = estimatedTxFee
      .div(gasPriceBn)
      .div(10 ** 9)
      .toFixed(0)
      .toString();

    return `Gas Limit: ${gasLimitBn}`;
  };

  renderFee = () => {
    const { estimatedTxFee } = this.props;

    return `Fee: ${fromWei(estimatedTxFee, 'ether')
      .toFixed(9)
      .toString()} ETH (gas limit * gas price)`;
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

  render () {
    const { showDetails } = this.props;

    return (
      <div>
        <DivTxForm hidden={!showDetails}>
          <LabelTextareaTxDetails htmlFor='txDetails'>
            Transaction Details:
          </LabelTextareaTxDetails>
          <TextareaTxDetails
            id='txDetails'
            readOnly
            value={this.renderDetails()}
          />
        </DivTxForm>
      </div>
    );
  }
}

export default TxDetails;
