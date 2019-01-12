// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { chainName$, withoutLoading } from '@parity/light.js';
import { inject, observer } from 'mobx-react';
import light from '@parity/light.js-react';
import { withProps } from 'recompose';
import { SentModal } from 'fether-ui';

import check from '../../assets/img/icons/check.svg';
import loading from '../../assets/img/icons/loading.svg';
import withTokens from '../../utils/withTokens';
import { blockscoutTxUrl } from '../../utils/blockscout';

// Number of confirmations to consider a transaction successful
const MIN_CONFIRMATIONS = 6;

@light({
  chainName: () => chainName$().pipe(withoutLoading())
})
@inject('sendStore')
@withTokens
@withProps(({ match: { params: { tokenAddress } }, tokens }) => ({
  token: tokens[tokenAddress]
}))
@observer
class Sent extends Component {
  componentWillMount () {
    // // If we refresh on this page, return to homepage
    // if (!this.props.sendStore.txStatus) {
    //   this.handleGoToHomepage();
    // }
  }

  handleGoToHomepage = () => {
    const { history, sendStore } = this.props;
    sendStore.clear();
    history.push('/');
  };

  render () {
    const { chainName, sendStore, token } = this.props;

    console.log('Sent.js');

    return (
      <div className='window_content'>
        <SentModal
          blockscoutTxUrl={blockscoutTxUrl}
          chainName={chainName}
          check={check}
          handleGoToHomepage={this.handleGoToHomepage()}
          loading={loading}
          minConfirmations={MIN_CONFIRMATIONS}
          sendStore={sendStore}
          token={token}
        />
      </div>
    );
  }
}

export default Sent;
