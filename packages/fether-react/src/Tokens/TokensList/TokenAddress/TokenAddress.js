// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { AccountCard } from 'fether-ui';
import { withRouter } from 'react-router-dom';

import withAccount from '../../../utils/withAccount';

@withRouter
@withAccount
@inject('sendStore')
class TokenAddress extends Component {
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
    const {
      account: { address, name, type }
    } = this.props;

    return (
      <AccountCard
        address={address}
        name={name}
        type={type}
        onClick={this.handleClick}
        shortAddress
        {...this.props}
      />
    );
  }
}

export default TokenAddress;
