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

  render() {
    const { accountsInfo } = this.props;

    return (
      <div>
        <nav className="header-nav">
          <p>&nbsp;</p>
          <Link to="/" className="header_title">
            Accounts
          </Link>
          <Link to="/accounts/new" className="icon -new">
            New account
          </Link>
        </nav>

        <div className="window_content">
          <div className="box -scroller">
            {accountsInfo
              ? <ul className="list -padded">
                  {Object.keys(accountsInfo).map(address =>
                    <li
                      key={address}
                      data-address={address} // Using data- to avoid creating a new item Component
                      onClick={this.handleClick}
                    >
                      <div className="account box -card -clickable">
                        <div className="account_avatar">
                          <Blockies seed={address} />
                        </div>
                        <div className="account_information">
                          <div className="account_name">
                            {accountsInfo[address].name}
                          </div>
                          <div className="account_address">
                            {address}
                          </div>
                        </div>
                      </div>
                    </li>
                  )}
                </ul>
              : <div className="loader">
                  <p>Loading&hellip;</p>
                </div>}
          </div>
        </div>
      </div>
    );
  }
}

export default Accounts;
