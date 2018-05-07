// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { accounts$, setDefaultAccount$ } from '@parity/light.js';
import { Link, Route } from 'react-router-dom';

import light from '../hoc';

@light({
  accounts: accounts$
})
class Accounts extends Component {
  handleChange = ({ target: { value } }) => {
    setDefaultAccount$(value);
  };

  render() {
    const { accounts } = this.props;

    return (
      <div>
        <p>Current account:</p>
        {accounts ? (
          <select onChange={this.handleChange} value={accounts[0]}>
            {accounts.map((account, index) => (
              <option key={account} value={account}>
                {account}
              </option>
            ))}
          </select>
        ) : (
          <p>Loading Accounts...</p>
        )}

        <p>
          {/* @brian TODO Inline style is ugly */}
          <Link to="/accounts/new" style={{ color: 'white' }}>
            <button>Create new account</button>
          </Link>
        </p>
      </div>
    );
  }
}

export default Accounts;
