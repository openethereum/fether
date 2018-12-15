// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { Header } from 'fether-ui';
import { inject, observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';
import Scanner from '../../Scanner';
import { withProps } from 'recompose';

import RequireHealth from '../../RequireHealthOverlay';
import withAccount from '../../utils/withAccount.js';
import withTokens from '../../utils/withTokens';

@inject('sendStore')
@withAccount
@withTokens
@withProps(({ match: { params: { tokenAddress } }, tokens }) => ({
  token: tokens[tokenAddress]
}))
@observer
class ScanSignedTx extends Component {
  onScanSignedTx = signature => {
    const {
      account: { address: accountAddress },
      history,
      sendStore: { signRaw },
      token
    } = this.props;

    signRaw('0x' + signature);

    history.push(
      `/send/${token.address}/from/${accountAddress}/signedtxsummary`
    );
  };

  render () {
    const {
      account: { address },
      history,
      sendStore: { tx },
      token
    } = this.props;

    if (!Object.keys(tx).length || !token) {
      return <Redirect to='/' />;
    }

    return (
      <div>
        <Header
          left={
            <Link to={`/tokens/${address}`} className='icon -back'>
              Close
            </Link>
          }
          title={token && <h1>Send {token.name}</h1>}
        />

        <RequireHealth require='sync'>
          <div className='window_content'>
            <div className='box -padded'>
              <Scanner
                onScan={this.onScanSignedTx}
                label='Please show the QR code of the signed transaction on the webcam.'
              />

              <nav className='form-nav -binary'>
                <button
                  className='button -cancel'
                  onClick={history.goBack}
                  type='button'
                >
                  Back
                </button>
              </nav>
            </div>
          </div>
        </RequireHealth>
      </div>
    );
  }
}

export default ScanSignedTx;
