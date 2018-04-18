// Copyright 2015-2017 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

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
