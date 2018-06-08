// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import abi from '@parity/shared/lib/contracts/abi/eip20';
import { defaultAccount$, makeContract$ } from '@parity/light.js';
import light from 'light-hoc';
import { Link } from 'react-router-dom';
import { map, switchMap } from 'rxjs/operators';
import PropTypes from 'prop-types';

import BalanceLayout from '../BalanceLayout';

@light({
  balance: ({ token: { address, decimals } }) =>
    defaultAccount$().pipe(
      switchMap(defaultAccount =>
        makeContract$(address, abi).balanceOf$(defaultAccount)
      ),
      map(value => +value.div(10 ** decimals))
    )
})
class TokenBalance extends Component {
  static propTypes = {
    token: PropTypes.object.isRequired
  };

  render () {
    return (
      <Link to='/send'>
        <BalanceLayout {...this.props} />
      </Link>
    );
  }
}

export default TokenBalance;
