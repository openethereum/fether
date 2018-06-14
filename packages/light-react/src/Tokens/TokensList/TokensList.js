// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import TokenBalance from './TokenBalance';

@inject('tokensStore')
@observer
class Tokens extends Component {
  render () {
    const {
      tokensStore: { tokensArray }
    } = this.props;

    // Show empty 3 tokens placeholders if tokens have not been loaded yet
    const shownArray = tokensArray.length ? tokensArray : Array(3).fill({});

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

export default Tokens;
