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
import withBalance from '../../../utils/withBalance';

@withRouter
@withAccount
@withBalance
@inject('sendStore')
class TokenBalance extends Component {
  static propTypes = {
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
