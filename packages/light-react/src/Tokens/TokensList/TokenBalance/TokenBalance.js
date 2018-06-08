// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import abi from '@parity/shared/lib/contracts/abi/eip20';
import { defaultAccount$, makeContract$, myBalance$ } from '@parity/light.js';
import { fromWei } from '@parity/api/lib/util/wei';
import { inject } from 'mobx-react';
import light from 'light-hoc';
import { withRouter } from 'react-router-dom';
import { map, switchMap } from 'rxjs/operators';
import PropTypes from 'prop-types';

@light({
  balance: ({ token: { address, decimals } }) =>
    address === 'ETH'
      ? myBalance$().pipe(map(value => +fromWei(value)))
      : defaultAccount$().pipe(
        switchMap(defaultAccount =>
          makeContract$(address, abi).balanceOf$(defaultAccount)
        ),
        map(value => +value.div(10 ** decimals))
      )
})
@inject('sendStore')
@withRouter
class TokenBalance extends Component {
  static propTypes = {
    token: PropTypes.object.isRequired
  };

  handleClick = () => {
    const {
      history,
      sendStore,
      token: { address }
    } = this.props;
    sendStore.setTokenFromAddress(address);
    history.push('/send');
  };

  render () {
    const { balance, token } = this.props;
    return (
      <a onClick={this.handleClick}>
        <div className='token box -card -clickable'>
          <div className='token_icon'>
            <img alt={token.symbol} src={token.logo} />
          </div>
          <div className='token_name'>{token.name}</div>
          <div className='token_balance'>
            {Number.isFinite(balance) ? balance.toFixed(2) : '...'}{' '}
            <span className='token_symbol'>{token.symbol}</span>
          </div>
        </div>
      </a>
    );
  }
}

export default TokenBalance;
