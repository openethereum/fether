// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { defaultAccount$ } from '@parity/light.js';

import EthBalance from './EthBalance';
import light from '../hoc';
import TokenBalance from './TokenBalance';

@inject('tokensStore')
@observer
@light({
  me: defaultAccount$
})
class Tokens extends Component {
  render () {
    const {
      me,
      tokensStore: { tokens }
    } = this.props;

    if (!me) {
      return null;
    }

    return (
      <div className='box -scroller'>
        <ul className='list -tokens'>
          {Array.from(tokens.keys()).map(key => (
            <li key={key}>
              {key === 'ETH' ? (
                <EthBalance address={me} token={key} {...tokens.get(key)} />
              ) : (
                <TokenBalance address={me} token={key} {...tokens.get(key)} />
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Tokens;
