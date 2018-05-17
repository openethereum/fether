// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { accountsInfo$ } from '@parity/light.js';
import Blockies from 'react-blockies';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import light from '../hoc';

@inject('parityStore')
@observer
@light({
  accountsInfo: accountsInfo$
})
class Accounts extends Component {
  handleClick = ({ currentTarget: { dataset: { address } } }) => {
    const { parityStore: { api } } = this.props;
    // Set default account to the clicked one, and go to Tokens on complete
    this.subscription = api.parity
      .setNewDappsDefaultAddress(address)
      .then(() => this.props.history.push('/tokens'));
  };

  render () {
    const { accountsInfo } = this.props;

    return (
      <div>
        {accountsInfo
          ? <ul>
            {Object.keys(accountsInfo).map(address =>
              <li
                key={address}
                data-address={address} // Using data- to avoid creating a new item Component
                onClick={this.handleClick}
              >
                <Blockies seed={address} />
                <strong>{accountsInfo[address].name}</strong> ({address})
              </li>
            )}
          </ul>
          : <p>Loading Accounts...</p>}

        <p>
          <Link to='/accounts/new'>
            <button>Create new account</button>
          </Link>
        </p>
      </div>
    );
  }
}

export default Accounts;
