// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { Card, Header } from 'fether-ui';
import { inject, observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';
import QrSigner from '@parity/qr-signer';
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
class TxQrCode extends Component {
  handleNextStep = () => {
    const {
      history,
      token,
      account: { address: accountAddress }
    } = this.props;
    history.push(`/send/${token.address}/from/${accountAddress}/scansignedtx`);
  };

  render () {
    const {
      account: { address },
      history,
      sendStore: { tx, getRlp },
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

        <RequireHealthOverlay require='sync'>
          <div className='window_content'>
            <div className='box -padded'>
              <Card className='-centered'>
                <p>
                  Please scan the QR code of the transaction on Parity Signer
                </p>
                <br />
                <QrSigner
                  scan={false}
                  onScan={() => {}}
                  account={address}
                  rlp={getRlp()}
                />
                <nav className='form-nav -space-around'>
                  <button
                    className='button -back'
                    onClick={history.goBack}
                    type='button'
                  >
                    Back
                  </button>

                  <button
                    className='button -submit'
                    onClick={this.handleNextStep}
                  >
                    Next step
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

export default TxQrCode;
