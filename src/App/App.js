// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// SPDX-License-Identifier: MIT

/* eslint-disable jsx-a11y/aria-role */

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Send from '../Send';
import Receive from '../Receive';
import Tokens from '../Tokens';
import './App.css';

class App extends Component {
  render () {
    return (
      <Router>
        <div className='wrapper' role='layout'>
          <div className='content App'>
            <div className='connector'>
              <svg width='60px' height='30px' viewBox='0 0 60 30'>
                <polygon points='0 30 60 30 30 0' />
              </svg>
            </div>
            <div className='window'>
              <Route exact path='/' component={Tokens} />
              <Route path='/send' component={Send} />
              <Route path='/receive' component={Receive} />

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
