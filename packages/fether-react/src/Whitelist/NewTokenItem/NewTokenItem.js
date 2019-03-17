// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { TokenCard } from 'fether-ui';
import { withRouter } from 'react-router-dom';

import i18n from '../../i18n';
import withTokens from '../../utils/withTokens';

@withRouter
@withTokens
class NewTokenItem extends Component {
  handleAddToken = async () => {
    const { history, token, addToken } = this.props;
    await addToken(token.address, token);
    history.goBack();
  };

  handleRemoveToken = async () => {
    const { history, token, removeToken } = this.props;
    await removeToken(token.address);
    history.goBack();
  };

  render () {
    const { token, tokens } = this.props;

    return (
      <li key={token.address}>
        <TokenCard balance={null} showBalance={false} token={token}>
          <div className='token_buttons'>
            {tokens[token.address] ? (
              <button
                className='button -utility -bad'
                onClick={this.handleRemoveToken}
              >
                {i18n.t('ns1:search_tokens.remove')}
              </button>
            ) : (
              <button
                className='button -utility -good'
                onClick={this.handleAddToken}
              >
                {i18n.t('ns1:search_tokens.add')}
              </button>
            )}
          </div>
        </TokenCard>
      </li>
    );
  }
}

export default NewTokenItem;
