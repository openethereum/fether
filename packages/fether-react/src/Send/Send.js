// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { provideTokens } from '../contexts/TokensContext.js';
import withAccount from '../utils/withAccount.js';

import Sent from './Sent';
import Signer from './Signer';
import TxForm from './TxForm';

@withAccount
@provideTokens
class Send extends Component {
  render () {
    const {
      match: { path }
    } = this.props;
    return (
      <Switch>
        <Route exact path={`${path}`} component={TxForm} />
        <Route path={`${path}/signer`} component={Signer} />
        <Route path={`${path}/sent`} component={Sent} />
        <Redirect to='/' />
      </Switch>
    );
  }
}

export default Send;
