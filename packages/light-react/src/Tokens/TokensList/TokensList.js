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

    return (
      <div className='window_content'>
        <div className='box -scroller'>
          <ul className='list -padded'>
            {tokensArray.map(token => (
              <li key={token.address}>{<TokenBalance token={token} />}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Tokens;
