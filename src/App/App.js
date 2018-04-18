// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Accounts from '../Accounts';
import Send from '../Send';
import Tokens from '../Tokens';
import './App.css';

class App extends Component {
  render () {
    return (
      <Router>
        <div className='App'>
          <h1>Light Wallet</h1>
          <ul>
            <li>
              <Link to='/'>Accounts</Link>
            </li>
            <li>
              <Link to='/tokens'>Tokens</Link>
            </li>
            <li>
              <Link to='/send'>Send</Link>
            </li>
          </ul>

          <hr />

          <Route exact path='/' component={Accounts} />
          <Route path='/tokens' component={Tokens} />
          <Route path='/send' component={Send} />
        </div>
      </Router>
    );
  }
}

export default App;
