// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { TokenCard } from 'fether-ui';
import { withRouter } from 'react-router-dom';

import withAccount from '../../../utils/withAccount.js';
import withBalance from '../../../utils/withBalance.js';
import { estimateUsd } from '../../../utils/estimateUsd';

@withRouter
@withAccount
@withBalance
@inject('sendStore')
class TokenBalance extends Component {
  static propTypes = {
    token: PropTypes.object
  };

  state = {
    usdBalance: null
  };

  componentDidMount = async () => {
    const { balance, token } = this.props;

    if (token.symbol === 'ETH') {
      this.setState({
        usdBalance: (await estimateUsd()) * balance
      });
    }
  };

  handleClick = () => {
    const { accountAddress, history, sendStore, token } = this.props;
    if (!token.address) {
      return;
    }
    sendStore.clear();
    history.push(`/send/${token.address}/from/${accountAddress}`);
  };

  render () {
    const { usdBalance } = this.state;

    return (
      <TokenCard
        onClick={this.handleClick}
        usdBalance={usdBalance}
        {...this.props}
      />
    );
  }
}

export default TokenBalance;
