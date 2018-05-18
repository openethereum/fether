// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, Route, Switch } from 'react-router-dom';

import Health from '../Health';
import EthBalance from './EthBalance';
import NewToken from './NewToken';
import TokenBalance from './TokenBalance';

@inject('tokensStore')
@observer
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
          <Route exact path='/tokens' render={this.renderTokensList} />
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

  renderTokensList = () => {
    const { tokensStore: { tokensArray } } = this.props;

    return (
      <div className='window_content'>
        <div className='box -scroller'>
          <ul className='list -padded'>
            {tokensArray.map(token =>
              <li key={token.address}>
                {token.address === 'ETH'
                  ? <EthBalance token={token} />
                  : <TokenBalance token={token} />}
              </li>
            )}
            <li>
              <Link to='/tokens/new'>Add/Remove Token</Link>
            </li>
          </ul>
        </div>
      </div>
    );
  };
}

export default Tokens;
