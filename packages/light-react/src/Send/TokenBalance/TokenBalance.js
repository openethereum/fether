// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import abi from '@parity/shared/lib/contracts/abi/eip20';
import { defaultAccount$, makeContract$, myBalance$ } from '@parity/light.js';
import { fromWei } from '@parity/api/lib/util/wei';
import light from 'light-hoc';
import { map, switchMap } from 'rxjs/operators';
import PropTypes from 'prop-types';

@light({
  balance: ({ token: { address, decimals } }) =>
    address === 'ETH'
      ? myBalance$().pipe(map(value => fromWei(value).toFixed(6))) // Get balance for Eth
      : defaultAccount$().pipe(
        switchMap(
          defaultAccount =>
            makeContract$(address, abi).balanceOf$(defaultAccount) // Call ERC20 contract for token
        ),
        map(value => value.div(10 ** decimals).toFixed(6))
      )
})
class TokenBalance extends Component {
  static propTypes = {
    token: PropTypes.object.isRequired
  };

  render () {
    const { balance, token } = this.props;
    return (
      <div className='token'>
        <div className='token_icon'>
          <img src={token.logo} alt={token.name} />
        </div>
        <div className='token_name'>{token.name}</div>
        <div className='token_balance'>
          {balance}
          <span className='token_symbol'>{token.symbol}</span>
        </div>
      </div>
    );
  }
}

export default TokenBalance;
