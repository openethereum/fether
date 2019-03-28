// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { inject } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TokenCard } from 'fether-ui';
import { withRouter } from 'react-router-dom';

import defaultTokenImage from '../../../assets/img/tokens/default-token-128x128.jpg';
import withAccount from '../../../utils/withAccount';
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
    return (
      <TokenCard
        onClick={this.handleClick}
        defaultTokenImage={defaultTokenImage}
        {...this.props}
      />
    );
  }
}

export default TokenBalance;
