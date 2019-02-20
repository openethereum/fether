// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { Card, Header } from 'fether-ui';
import { inject, observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';
import Scanner from '../../Scanner';
import { withProps } from 'recompose';

import RequireHealthOverlay from '../../RequireHealthOverlay';
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
  state = {
    error: null
  };

  onScanSignedTx = signature => {
    const {
      account: { address: accountAddress },
      history,
      sendStore: { signRaw },
      token
    } = this.props;

    try {
      signRaw('0x' + signature);
      history.push(
        `/send/${token.address}/from/${accountAddress}/signedtxsummary`
      );
    } catch (e) {
      this.setState({
        error: "The QR code doesn't seem to be a valid transaction."
      });
    }
  };

  render () {
    const {
      account: { address },
      history,
      sendStore: { tx },
      token
    } = this.props;
    const { error } = this.state;

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

        <RequireHealthOverlay require='sync'>
          <div className='window_content'>
            <div className='box -padded'>
              <Card className='-centered'>
                <Scanner
                  onScan={this.onScanSignedTx}
                  label="Show Parity Signer account\'s QR code"
                />

                {error && <p className='text -standard'>{error}</p>}

                <nav className='form-nav -space-around'>
                  <button
                    className='button -back'
                    onClick={history.goBack}
                    type='button'
                  >
                    Back
                  </button>
                </nav>
              </Card>
            </div>
          </div>
        </RequireHealthOverlay>
      </div>
    );
  }
}

export default ScanSignedTx;
