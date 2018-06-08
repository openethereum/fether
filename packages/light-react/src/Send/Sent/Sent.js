// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { blockNumber$ } from '@parity/light.js';
import { inject, observer } from 'mobx-react';
import light from 'light-hoc';

import check from '../../assets/img/icons/check.svg';
import loading from '../../assets/img/icons/loading.svg';

@light({
  blockNumber: blockNumber$
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
      sendStore: { txStatus }
    } = this.props;

    if (txStatus.confirmed) {
      return 'Successfully sent';
    }

    if (txStatus.failed) {
      return JSON.stringify(txStatus.failed);
    }

    return null;
  };

  renderIcon = () => {
    const {
      sendStore: { txStatus }
    } = this.props;
    if (txStatus.confirmed) {
      return check;
    }
    return loading;
  };

  renderTitle = () => {
    const {
      sendStore: { txStatus }
    } = this.props;
    console.log(txStatus);

    if (txStatus.confirmed) {
      return 'Successfully sent';
    }

    if (txStatus.failed) {
      return 'Error';
    }

    return 'Sending your transaction...';
  };
}

export default Sent;
