// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { PureComponent } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

@inject('tokensStore')
@observer
@withRouter
class NewTokenItem extends PureComponent {
  handleAddToken = () => {
    const { history, token, tokensStore } = this.props;
    tokensStore.addToken(token.address, token);
    history.goBack();
  };

  handleRemoveToken = () => {
    const { history, token, tokensStore } = this.props;
    tokensStore.removeToken(token.address);
    history.goBack();
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
          {tokens.has(token.address)
            ? <button onClick={this.handleRemoveToken}>Remove</button>
            : <button onClick={this.handleAddToken}>Add</button>}
        </div>
      </li>
    );
  }
}

export default NewTokenItem;
