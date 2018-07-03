// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Redirect, Switch } from 'react-router-dom';

import Sent from './Sent';
import Signer from './Signer';
import TxForm from './TxForm';

@inject('sendStore')
@observer
class Send extends Component {
  render () {
    const {
      sendStore: { tokenAddress }
    } = this.props;

    // We only show then Send components if we have already selected a token to
    // send.
    if (!tokenAddress) {
      return <Redirect to='/' />;
    }

    return (
      <Switch>
        <Route exact path='/send' component={TxForm} />
        <Route path='/send/signer' component={Signer} />
        <Route path='/send/sent' component={Sent} />
      </Switch>
    );
  }
}

export default Send;
