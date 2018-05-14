// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { BrowserRouter, MemoryRouter, Route, Link } from 'react-router-dom';

import CreateAccount from '../Accounts/CreateAccount';
import Loading from '../Loading';
import ProtectedRoute from './ProtectedRoute';
import Receive from '../Receive';
import Send from '../Send';
import Settings from '../Settings';
import Signer from '../Signer';
import Tokens from '../Tokens';
import './App.css';

// Use MemoryRouter for production viewing in file:// protocol
// https://github.com/facebook/create-react-app/issues/3591
const Router =
  process.env.NODE_ENV === 'production' ? MemoryRouter : BrowserRouter;

class App extends Component {
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
              <nav className='header-nav'>
                <Link to='/'>Wallet</Link>
              </nav>

              <div className='window_content'>
                <Route path='/loading' component={Loading} />
                <ProtectedRoute exact path='/' component={Tokens} />
                <ProtectedRoute path='/settings' component={Settings} />
                <ProtectedRoute path='/send' component={Send} />
                <ProtectedRoute path='/signer' component={Signer} />
                <ProtectedRoute path='/receive' component={Receive} />
                <ProtectedRoute path='/accounts/new' component={CreateAccount} />
              </div>

              <nav className='footer-nav'>
                <div className='footer-nav_status'>
                  <div className='status'>
                    <span className='status_icon -alright'>
                      <svg viewBox='0 0 20 20'>
                        <circle fill='#000000' cx='10' cy='10' r='10' />
                      </svg>
                    </span>
                    <span className='status_text'>Syncing (1h6m)</span>
                  </div>
                </div>
                <div className='footer-nav_icons'>
                  <Link to='/settings' className='icon -settings'>
                    Settings
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
