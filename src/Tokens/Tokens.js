// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';

import EthBalance from './EthBalance';
import NewToken from './NewToken';
import TokenBalance from './TokenBalance';

@inject('parityStore', 'tokensStore')
@observer
class Tokens extends Component {
  render () {
    const { parityStore: { isApiConnected } } = this.props;

    if (!isApiConnected) {
      return <Redirect to='/loading' />;
    }

    return (
      <Switch>
        <Route exact path='/tokens' render={this.renderTokensList} />
        <Route path='/tokens/new' component={NewToken} />
      </Switch>
    );
  }

  renderTokensList = () => {
    const { tokensStore: { tokens } } = this.props;

    return (
      <div className='box -scroller'>
        <ul className='list -tokens'>
          {Array.from(tokens.keys()).map(key =>
            <li key={key}>
              {key === 'ETH'
                ? <EthBalance token={key} {...tokens.get(key)} />
                : <TokenBalance token={key} {...tokens.get(key)} />}
            </li>
          )}
          <li>
            <Link to='/tokens/new'>Add Token</Link>
          </li>
        </ul>
      </div>
    );
  };
}

export default Tokens;
