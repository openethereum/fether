// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import ScanSignedTx from './ScanSignedTx';
import Sent from './Sent';
import SignedTxSummary from './SignedTxSummary';
import TxForm from './TxForm';
import TxQrCode from './TxQrCode';
import Unlock from './Unlock';

class Send extends Component {
  render () {
    const {
      match: { path }
    } = this.props;
    return (
      <Switch>
        <Route exact path={`${path}`} component={TxForm} />
        <Route path={`${path}/unlock`} component={Unlock} />
        <Route path={`${path}/txqrcode`} component={TxQrCode} />
        <Route path={`${path}/scansignedtx`} component={ScanSignedTx} />
        <Route path={`${path}/signedtxsummary`} component={SignedTxSummary} />
        <Route path={`${path}/sent`} component={Sent} />
        <Redirect to='/' />
      </Switch>
    );
  }
}

export default Send;
