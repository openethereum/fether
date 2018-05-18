// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';

import Health from '../Health';
import NewToken from './NewToken';
import TokensList from './TokensList';

class Tokens extends Component {
  render () {
    return (
      <div>
        <nav className='header-nav'>
          <Link to='/accounts' className='icon -back'>
            Back
          </Link>
          <Link to='/tokens'>
            {/* TODO: account name */}
            test
          </Link>
          <Link to='/receive' className='icon -receive'>
            {/* TODO: Don't worry -- this isn't good UX and won't stick around. */}
            Receive
          </Link>
        </nav>

        <Switch>
          <Route exact path='/tokens' component={TokensList} />
          <Route path='/tokens/new' component={NewToken} />
        </Switch>

        <nav className='footer-nav'>
          <div className='footer-nav_status'>
            <Health />
          </div>
          <div className='footer-nav_icons'>
            <Link to='/settings' className='icon -settings'>
              Settings
            </Link>
          </div>
        </nav>
      </div>
    );
  }
}

export default Tokens;
