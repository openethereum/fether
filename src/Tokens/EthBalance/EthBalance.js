// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { balanceOf$ } from '@parity/light.js';

import BalanceLayout from '../BalanceLayout';
import light from '../../hoc';

@light({
  balance: ({ address }) => balanceOf$(address)
})
class EthBalance extends Component {
  render () {
    return <BalanceLayout {...this.props} />;
  }
}

export default EthBalance;
