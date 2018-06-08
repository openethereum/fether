// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { PureComponent } from 'react';
import { fromWei } from '@parity/api/lib/util/wei';
import light from 'light-hoc';
import { Link } from 'react-router-dom';
import { map } from 'rxjs/operators';
import { myBalance$ } from '@parity/light.js';
import PropTypes from 'prop-types';

import BalanceLayout from '../BalanceLayout';

@light({
  balance: () => myBalance$().pipe(map(value => +fromWei(value)))
})
class EthBalance extends PureComponent {
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

export default EthBalance;
