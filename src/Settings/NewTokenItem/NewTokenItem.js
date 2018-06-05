// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

@inject('tokensStore')
@observer
@withRouter
class NewTokenItem extends Component {
  handleAddToken = () => {
    const { history, token, tokensStore } = this.props;
    tokensStore.addToken(token.address, token);
    this.forceUpdate(); // TODO: I assume this is not the preferred way to do this!
  };

  handleRemoveToken = () => {
    const { history, token, tokensStore } = this.props;
    tokensStore.removeToken(token.address);
    this.forceUpdate();
  };

  render () {
    const { token, tokensStore: { tokens } } = this.props;

    return (
      <li key={token.address}>
        <div className='token box -card -clickable'>
          <div className='token_icon'>
            <img alt={token.symbol} src={token.logo} />
          </div>
          <div className='token_name'>
            {token.name}
          </div>
          <div className='token_balance'>
            <span className='token_symbol'>
              {token.symbol}
            </span>
          </div>
          <div className='token_buttons'>
            {tokens.has(token.address)
              ? <button className='button -utility -bad' onClick={this.handleRemoveToken}>Remove</button>
              : <button className='button -utility -good' onClick={this.handleAddToken}>Add</button>}
          </div>
        </div>
      </li>
    );
  }
}

export default NewTokenItem;
