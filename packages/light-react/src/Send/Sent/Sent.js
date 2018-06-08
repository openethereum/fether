// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { chainName$ } from '@parity/light.js';
import { inject, observer } from 'mobx-react';
import light from 'light-hoc';

import check from '../../assets/img/icons/check.svg';
import loading from '../../assets/img/icons/loading.svg';

@light({
  chainName: chainName$
})
@inject('sendStore')
@observer
class Sent extends Component {
  render () {
    return (
      <div className='alert-screen'>
        <div className='alert-screen_content'>
          <div className='alert-screen_image'>
            <img alt='loading' src={this.renderIcon()} />
          </div>
          <div className='alert-screen_text'>
            <h1>{this.renderTitle()}</h1>
            <p>{this.renderDescription()}</p>
          </div>
        </div>
      </div>
    );
  }

  renderDescription = () => {
    const {
      sendStore: { confirmations, txStatus }
    } = this.props;

    if (confirmations > 0) {
      return `It has been confirmed ${
        confirmations === 1 ? 'once' : `${confirmations} times`
      }`;
    }

    if (txStatus.confirmed) {
      return 'Waiting for confirmations...';
    }

    if (txStatus.failed) {
      return JSON.stringify(txStatus.failed);
    }

    return null;
  };

  renderIcon = () => {
    const {
      sendStore: { confirmations }
    } = this.props;
    if (confirmations >= 6) {
      return check;
    }
    return loading;
  };

  renderTitle = () => {
    const {
      chainName,
      sendStore: { txStatus }
    } = this.props;

    if (txStatus.confirmed) {
      return (
        <span>
          Your transaction is{' '}
          <a
            className='button -tiny'
            href={`https://${
              chainName === 'foundation' ? '' : `${chainName}.`
            }etherscan.io/tx/${txStatus.confirmed.transactionHash}`}
            target='_blank'
          >
            on the blockchain
          </a>
        </span>
      );
    }

    if (txStatus.failed) {
      return 'Error';
    }

    return 'Sending your transaction...';
  };
}

export default Sent;
