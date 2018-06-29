// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { TokenCard } from 'fether-ui';
import { withRouter } from 'react-router-dom';

@withRouter
@inject('tokensStore')
@observer
class NewTokenItem extends Component {
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
    const {
      token,
      tokensStore: { tokens }
    } = this.props;

    return (
      <li key={token.address}>
        <TokenCard balance={null} showBalance={false} token={token}>
          <div className='token_buttons'>
            {tokens[token.address] ? (
              <button
                className='button -utility -bad'
                onClick={this.handleRemoveToken}
              >
                Remove
              </button>
            ) : (
              <button
                className='button -utility -good'
                onClick={this.handleAddToken}
              >
                Add
              </button>
            )}
          </div>
        </TokenCard>
      </li>
    );
  }
}

export default NewTokenItem;
