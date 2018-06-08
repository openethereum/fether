// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, Route, Redirect, Switch } from 'react-router-dom';

import Sent from './Sent';
import Signer from './Signer';
import TxForm from './TxForm';

@inject('sendStore')
@observer
class Send extends Component {
  render () {
    const {
      sendStore: { token }
    } = this.props;

    if (!token) {
      return <Redirect to='/' />;
    }

    return (
      <div>
        <nav className='header-nav'>
          <div className='header-nav_left'>
            <Link to='/tokens' className='icon -close'>
              Close
            </Link>
          </div>
          <div className='header-nav_title'>
            <h1>Send {token.name}</h1>
          </div>
          <div className='header-nav_right' />
        </nav>
        <div className='window_content'>
          <div className='box -padded'>
            <Switch>
              <Route exact path='/send' component={TxForm} />
              <Route path='/send/signer' component={Signer} />
              <Route path='/send/sent' component={Sent} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default Send;
