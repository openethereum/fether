// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import {
  BrowserRouter,
  MemoryRouter,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import Accounts from '../Accounts';
import Overlay from '../Overlay';
import Receive from '../Receive';
import Send from '../Send';
import Settings from '../Settings';
import Signer from '../Send/Signer';
import { STATUS } from '../stores/healthStore';
import Tokens from '../Tokens';
import './App.css';

// Use MemoryRouter for production viewing in file:// protocol
// https://github.com/facebook/create-react-app/issues/3591
const Router =
  process.env.NODE_ENV === 'production' ? MemoryRouter : BrowserRouter;

@inject('healthStore')
@observer
class App extends Component {
  render () {
    const {
      healthStore: {
        health: { status }
      }
    } = this.props;

    return (
      <Router>
        <div className='wrapper'>
          <div className='content'>
            <div className='connector'>
              <svg width='60px' height='30px' viewBox='0 0 60 30'>
                <polygon points='0 30 60 30 30 0' />
              </svg>
            </div>
            <div className='window'>
              {status === STATUS.GOOD ? (
                <Switch>
                  {/* Change homepage on the next line */}
                  <Redirect exact from='/' to='/tokens' />
                  <Route path='/accounts' component={Accounts} />
                  <Route path='/tokens' component={Tokens} />
                  <Route path='/receive' component={Receive} />
                  <Route path='/settings' component={Settings} />
                  <Route path='/send' component={Send} />
                  <Route path='/signer' component={Signer} />
                  <Redirect from='*' to='/' />
                </Switch>
              ) : (
                <Overlay />
              )}
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
