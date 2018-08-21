// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import Sent from './Sent';
import Signer from './Signer';
import TxForm from './TxForm';

class Send extends Component {
  render () {
    const {
      match: { url }
    } = this.props;

    return (
      <Switch>
        <Route exact path={`${url}/:tokenAddress`} component={TxForm} />
        <Route path={`${url}/:tokenAddress/signer`} component={Signer} />
        <Route path={`${url}/:tokenAddress/sent`} component={Sent} />
        <Redirect to='/' />
      </Switch>
    );
  }
}

export default Send;
