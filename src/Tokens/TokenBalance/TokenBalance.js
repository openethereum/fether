// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import BalanceLayout from '../BalanceLayout';

class TokenBalance extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired
  };

  render () {
    const balance = Math.round(Math.random() * 1000000000000000000000);
    return <BalanceLayout balance={balance} {...this.props} />;
  }
}

export default TokenBalance;
