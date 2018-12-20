// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { chainName$, isLoading } from '@parity/light.js';
import light from '@parity/light.js-react';
import { inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { TokenCard } from 'fether-ui';
import { withRouter } from 'react-router-dom';

import withAccount from '../../../utils/withAccount.js';
import withBalance from '../../../utils/withBalance';
import { blockscoutAccountUrl } from '../../../utils/blockscout';

@light({
  chainName: chainName$
})
@withRouter
@withAccount
@withBalance
@inject('sendStore')
class TokenBalance extends Component {
  static propTypes = {
    token: PropTypes.object
  };

  openBlockscoutLink () {
    const { accountAddress, chainName, token } = this.props;

    if (isLoading(chainName) || !accountAddress || !token.address) {
      return;
    }

    window.open(
      blockscoutAccountUrl(accountAddress, chainName, token.address),
      '_blank'
    );
  }

  handleClick = () => {
    const { accountAddress, history, sendStore, token } = this.props;
    if (!token.address) {
      return;
    }
    sendStore.clear();
    history.push(`/send/${token.address}/from/${accountAddress}`);
  };

  render () {
    return (
      <TokenCard
        onClick={this.handleClick}
        openBlockscoutLink={() => this.openBlockscoutLink()}
        {...this.props}
      />
    );
  }
}

export default TokenBalance;
