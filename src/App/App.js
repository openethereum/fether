// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { BrowserRouter, MemoryRouter, Route, Link } from 'react-router-dom';

import Loading from '../Loading';
import ProtectedRoute from './ProtectedRoute';
import Send from '../Send';
import Receive from '../Receive';
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
              <ProtectedRoute exact path='/' component={Tokens} />
              <Route path='/loading' component={Loading} />
              <ProtectedRoute path='/send' component={Send} />
              <ProtectedRoute path='/receive' component={Receive} />

              <nav className='primary-nav'>
                <Link to='/receive' className='icon -receive'>
                  Receive
                </Link>
                <Link to='/' className='icon -settings'>
                  Settings
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
