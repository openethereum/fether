// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';

import defaultTokenImage from '../../assets/img/tokens/default-token-128x128.jpg';
import RequireHealthOverlay from '../../RequireHealthOverlay';
import TokenBalance from './TokenBalance';
import withTokens from '../../utils/withTokens';

@withTokens
class TokensList extends Component {
  render () {
    const { tokensArray } = this.props;
    // Show empty token placeholder if tokens have not been loaded yet
    const shownArray = tokensArray.length ? tokensArray : [{}];
    return (
      <RequireHealthOverlay require='sync'>
        <div className='window_content'>
          <div className='box -scroller'>
            <ul className='list -padded'>
              {shownArray.map((
                token,
                index // With empty tokens, the token.address is not defined, so we prefix with index
              ) => (
                <li key={`${index}-${token.address}`}>
                  <TokenBalance
                    token={token}
                    defaultTokenImage={defaultTokenImage}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </RequireHealthOverlay>
    );
  }
}

export default TokensList;
