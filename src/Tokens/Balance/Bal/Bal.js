// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// SPDX-License-Identifier: MIT

import React, { Component } from 'react';

import light from '../../../hoc';
import { defaultAccount$ } from '../../../lib'; // from '@parity/light'

@light({
  defaultAccount: defaultAccount$
})
class Bal extends Component {
  render() {
    const { chainStatus, defaultAccount } = this.props;
    return (
      <div>
        <p>chainStatus: {JSON.stringify(chainStatus)}</p>
        <p>defaultAccount: {defaultAccount}</p>
      </div>
    );
  }
}

export default Bal;
