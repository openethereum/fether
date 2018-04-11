// Copyright 2015-2017 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

import React, { Component } from 'react';

import light from '../hoc';
import { balanceOf$, chainName$, defaultAccount$, height$ } from '../lib'; // from '@parity/light'

@light({
  balance: ownProps => balanceOf$(ownProps.address),
  chainName: chainName$,
  defaultAccount: defaultAccount$,
  height: height$
})
class Balance extends Component {
  render() {
    const { balance, chainName, defaultAccount, height } = this.props;
    return (
      <div>
        <p>Chain: {chainName}.</p>
        <p>Block: {height}.</p>
        <p>My Account: {defaultAccount}.</p>
        <p>My Balance: {balance}.</p>
        <button>Send 0.01ETH to myself</button>
        <p>Tx progress: </p>
      </div>
    );
  }
}

export default Balance;
