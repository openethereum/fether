// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { PureComponent } from 'react';
import {
  BrowserRouter,
  MemoryRouter,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';

import Accounts from '../Accounts';
import Loading from '../Loading';
import ProtectedRoute from './ProtectedRoute';
import Receive from '../Receive';
import Send from '../Send';
import Settings from '../Settings';
import Signer from '../Send/Signer';
import Tokens from '../Tokens';
import './App.css';

// Use MemoryRouter for production viewing in file:// protocol
// https://github.com/facebook/create-react-app/issues/3591
const Router =
  process.env.NODE_ENV === 'production' ? MemoryRouter : BrowserRouter;

class App extends PureComponent {
  render () {
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
              <Switch>
                {/* Change homepage on the next line */}
                <Redirect exact from='/' to='/tokens' />
                <Route path='/loading' component={Loading} />
                <ProtectedRoute path='/accounts' component={Accounts} />
                <ProtectedRoute path='/tokens' component={Tokens} />
                <ProtectedRoute path='/receive' component={Receive} />
                <ProtectedRoute path='/settings' component={Settings} />
                <ProtectedRoute path='/send' component={Send} />
                <ProtectedRoute path='/signer' component={Signer} />
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
