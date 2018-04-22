// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// SPDX-License-Identifier: MIT

import React, { Component } from 'react';

import Bal from './Bal';
import light from '../../hoc';
import { balanceOf$, chainName$, defaultAccount$, height$ } from '../../lib'; // from '@parity/light'
import TxProgress from './TxProgress';

@light({
  balance: ownProps => balanceOf$(ownProps.address),
  chainName: chainName$,
  defaultAccount: defaultAccount$,
  height: height$
})
class Balance extends Component {
  state = { visible: false };

  componentDidMount() {
    setTimeout(() => this.setState({ visible: true }), 3000);
  }

  handleSend = () => {
    this.setState({
      tx: {
        from: this.props.defaultAccount,
        to: this.props.defaultAccount,
        value: '0x2386f26fc10000' // 0.01ETH
      }
    });
  };

  render() {
    const { balance, chainName, defaultAccount, height } = this.props;
    const { tx, visible } = this.state;
    return (
      <div className="token">
        <img className="token_icon" />
        <span className="token_name">
          Ethereum
        </span>
        <span className="token_quantity">
          42.31
        </span>
      </div>
    );
  }
}

export default Balance;
