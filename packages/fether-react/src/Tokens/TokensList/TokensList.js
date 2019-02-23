// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { Modal } from 'fether-ui';
import RequireHealthOverlay from '../../RequireHealthOverlay';
import TokenBalance from './TokenBalance';
import withTokens from '../../utils/withTokens';
import loading from '../../assets/img/icons/loading.svg';

@withTokens
class TokensList extends Component {
  state = {
    isLoadingAccountTokens: true
  };

  hideLoadingAccountTokensModal = () => {
    this.setState({ isLoadingAccountTokens: false });
  };

  render () {
    const { tokensArray } = this.props;
    const { isLoadingAccountTokens } = this.state;
    // Show empty token placeholder if tokens have not been loaded yet
    const shownArray = tokensArray.length ? tokensArray : [{}];

    return (
      <RequireHealthOverlay require='sync'>
        <Modal
          description='Please wait...'
          fullscreen={false}
          icon={loading}
          title='Loading account tokens...'
          visible={isLoadingAccountTokens}
        />
        <div className='window_content'>
          <div className='box -scroller'>
            <ul className='list -padded'>
              {shownArray.map((
                token,
                index // With empty tokens, the token.address is not defined, so we prefix with index
              ) => (
                <li key={`${index}-${token.address}`}>
                  <TokenBalance
                    hideLoadingAccountTokensModal={
                      this.hideLoadingAccountTokensModal
                    }
                    token={token}
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
