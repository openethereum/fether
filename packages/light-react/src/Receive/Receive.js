// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { PureComponent } from 'react';
import { accountsInfo$, defaultAccount$ } from '@parity/light.js';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Header } from 'light-ui';
import light from 'light-hoc';
import { Link } from 'react-router-dom';

@light({
  accountsInfo: accountsInfo$,
  defaultAccount: defaultAccount$
})
class Receive extends PureComponent {
  render () {
    const { accountsInfo, defaultAccount } = this.props;

    return (
      <div>
        <Header
          left={
            <Link to='/tokens' className='icon -close'>
              Close
            </Link>
          }
          title={
            <h1>
              {accountsInfo && defaultAccount && accountsInfo[defaultAccount]
                ? accountsInfo[defaultAccount].name
                : 'Loading...'}
            </h1>
          }
        />
        <div className='window_content'>
          <div className='box -padded'>
            <div className='box -card'>
              <div className='text'>
                <p>Your address is:</p>
              </div>
              <div className='text -code'>{defaultAccount}</div>
              <div className='box text -right'>
                <CopyToClipboard text={defaultAccount}>
                  <button
                    className='button -utility'
                    onClick={this.handleCopyPublicAddress}
                  >
                    Copy address to clipboard
                  </button>
                </CopyToClipboard>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Receive;
