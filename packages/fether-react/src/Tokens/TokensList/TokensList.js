// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

import TokenBalance from './TokenBalance';

import { consumeTokens } from '../../contexts/TokensContext.js';

@withRouter
@consumeTokens
class TokensList extends Component {
  render () {
    const { tokensArray } = this.props;

    // Show empty token placeholder if tokens have not been loaded yet
    const shownArray = tokensArray.length ? tokensArray : [{}];

    return (
      <div className='window_content'>
        <div className='box -scroller'>
          <ul className='list -padded'>
            {shownArray.map((
              token,
              index // With empty tokens, the token.address is not defined, so we prefix with index
            ) => (
              <li key={`${index}-${token.address}`}>
                <TokenBalance token={token} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default TokensList;
