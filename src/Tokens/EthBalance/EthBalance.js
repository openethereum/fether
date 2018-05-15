// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { balanceOf$, defaultAccount$ } from '@parity/light.js';
import { fromWei } from '@parity/api/lib/util/wei';
import { Link } from 'react-router-dom';
import { map, switchMap } from 'rxjs/operators';

import BalanceLayout from '../BalanceLayout';
import light from '../../hoc';

@light({
  balance: () =>
    defaultAccount$().pipe(
      switchMap(balanceOf$),
      map(value => +fromWei(value.toString()))
    )
})
class EthBalance extends Component {
  render () {
    return (
      <Link to='/send'>
        <BalanceLayout {...this.props} />
      </Link>
    );
  }
}

export default EthBalance;
