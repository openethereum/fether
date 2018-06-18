// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { chainName$ } from '@parity/light.js';
import { inject, observer } from 'mobx-react';
import light from 'light-hoc';
import { Link } from 'react-router-dom';

import check from '../../assets/img/icons/check.svg';
import loading from '../../assets/img/icons/loading.svg';

// Number of confirmations to consider a transaction successful
const MIN_CONFIRMATIONS = 6;

@light({
  chainName: chainName$
})
@inject('sendStore')
@observer
class Sent extends Component {
  render () {
    const {
      chainName,
      sendStore: { confirmations, txStatus }
    } = this.props;

    return (
      <div className='window_content'>
        <div className='alert-screen'>
          <div className='alert-screen_content'>
            <div className='alert-screen_image'>
              <img alt='loading' src={this.renderIcon()} />
            </div>
            <div className='alert-screen_text'>
              <h1>{this.renderTitle()}</h1>
              <p>{this.renderDescription()}</p>
            </div>
            {confirmations >= MIN_CONFIRMATIONS && (
              <nav className='form-nav -binary'>
                <Link to='/'>
                  <button className='button' disabled={confirmations < 6}>
                    Go back
                  </button>
                </Link>
                <a
                  href={`https://${
                    chainName === 'foundation' ? '' : `${chainName}.`
                  }etherscan.io/tx/${txStatus.confirmed.transactionHash}`}
                  target='_blank'
                >
                  <button className='button -tiny'>See it on Etherscan</button>
                </a>
              </nav>
            )}
          </div>
        </div>
      </div>
    );
  }

  renderDescription = () => {
    const {
      sendStore: { confirmations, txStatus }
    } = this.props;

    if (confirmations >= MIN_CONFIRMATIONS) {
      return null;
    }

    if (confirmations > 0) {
      return `Waiting ${confirmations}/${MIN_CONFIRMATIONS} confirmations`;
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
    if (confirmations >= MIN_CONFIRMATIONS) {
      return check;
    }
    return loading;
  };

  renderTitle = () => {
    const {
      sendStore: { confirmations, txStatus }
    } = this.props;

    if (txStatus.confirmed) {
      return (
        <span>
          {confirmations >= MIN_CONFIRMATIONS
            ? 'Transaction confirmed'
            : 'Submitted'}
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
