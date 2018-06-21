// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { TokenCard } from 'light-ui';
import { withRouter } from 'react-router-dom';

import withBalance from '../../../utils/withBalance';

@withBalance()
@inject('sendStore')
@withRouter
class TokenBalance extends Component {
  static propTypes = {
    token: PropTypes.object.isRequired
  };

  handleClick = () => {
    const { history, sendStore, token } = this.props;
    if (!token.address) {
      return;
    }
    sendStore.setTokenAddress(token.address);
    history.push('/send');
  };

  render () {
    return <TokenCard onClick={this.handleClick} {...this.props} />;
  }
}

export default TokenBalance;
