// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { TokenCard } from 'fether-ui';
import { withRouter } from 'react-router-dom';

import withAccount from '../../../utils/withAccount';
import withBalance from '../../../utils/withBalance';

@withRouter
@withAccount
@withBalance
@inject('sendStore')
class TokenBalance extends Component {
  static propTypes = {
    account: PropTypes.object,
    balance: PropTypes.object,
    decimals: PropTypes.number,
    drawers: PropTypes.array,
    erc20Balance: PropTypes.object,
    history: PropTypes.object.isRequired,
    location: PropTypes.object,
    match: PropTypes.object,
    onClick: PropTypes.func,
    sendStore: PropTypes.object,
    staticContext: PropTypes.object,
    token: PropTypes.object
  };

  handleClick = () => {
    const {
      account: { address },
      history,
      sendStore,
      token
    } = this.props;

    if (!token.address) {
      return;
    }

    sendStore.clear();
    history.push(`/send/${token.address}/from/${address}`);
  };

  render () {
    return <TokenCard onClick={this.handleClick} {...this.props} />;
  }
}

export default TokenBalance;
