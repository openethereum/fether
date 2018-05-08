// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import {
  allAccountsInfo$,
  defaultAccount$,
  setDefaultAccount$
} from '@parity/light.js';
import { Link } from 'react-router-dom';

import light from '../hoc';

@light({
  allAccountsInfo: allAccountsInfo$,
  defaultAccount: defaultAccount$
})
class Accounts extends Component {
  handleChange = ({ target: { value } }) => {
    setDefaultAccount$(value);
  };

  render () {
    const { allAccountsInfo, defaultAccount } = this.props;

    return (
      <div>
        <p>Current account:</p>
        {allAccountsInfo ? (
          <select onChange={this.handleChange} value={defaultAccount}>
            {Object.keys(allAccountsInfo).map(address => (
              <option key={address} value={address}>
                {allAccountsInfo[address].name} ({address})
              </option>
            ))}
          </select>
        ) : (
          <p>Loading Accounts...</p>
        )}

        <p>
          {/* @brian TODO Inline style is ugly */}
          <Link to='/accounts/new' style={{ color: 'white' }}>
            <button>Create new account</button>
          </Link>
        </p>
      </div>
    );
  }
}

export default Accounts;
