// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { myBalance$ } from '@parity/light.js';
import { fromWei } from '@parity/api/lib/util/wei';
import { Link } from 'react-router-dom';
import { map } from 'rxjs/operators';
import PropTypes from 'prop-types';

import BalanceLayout from '../BalanceLayout';
import light from '../../hoc';

@light({
  balance: () => myBalance$().pipe(map(value => +fromWei(value.toString())))
})
class EthBalance extends Component {
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
