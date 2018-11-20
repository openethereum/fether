// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { PureComponent } from "react";
import { AccountHeader, Form as FetherForm } from "fether-ui";
import { accountsInfo$ } from "@parity/light.js";
import light from "@parity/light.js-react";
import { Link, Redirect, withRouter } from "react-router-dom";

import Health from "../Health";
import TokensList from "./TokensList";
import withAccount from "../utils/withAccount";

// import { inject, observer } from 'mobx-react';

@withRouter
@withAccount
@light({
  accountsInfo: accountsInfo$
})
// @inject("createAccountStore")
// @observer
class Tokens extends PureComponent {
  state = {
    password: "",
    toggleBackupScreen: false
  };

  handleGoToWhitelist = () => {
    this.props.history.push(`/whitelist/${this.props.accountAddress}`);
  };

  // handleExportBackupJson = async () => {
  //   const { createAccountStore } = this.props;
  //   const { password } = this.state;
  //
  //   await createAccountStore.backupAccount();
  //
  // }

  handlePasswordChange = password => {
    this.setState({ password });
  };

  toggleBackupScreen = () => {
    const { toggleBackupScreen } = this.state;
    this.setState({ toggleBackupScreen: !toggleBackupScreen });
  };

  render() {
    const { password, toggleBackupScreen } = this.state;
    const { accountsInfo, accountAddress } = this.props;

    // If the accountsInfo object is empty (i.e. no accounts), then we redirect
    // to the accounts page to create an account
    if (accountsInfo && !Object.keys(accountsInfo).length) {
      return <Redirect to="/accounts/new" />;
    }

    return (
      <div>
        <AccountHeader
          address={accountAddress}
          copyAddress
          name={
            accountsInfo &&
            accountsInfo[accountAddress] &&
            accountsInfo[accountAddress].name
          }
          left={
            <Link to="/accounts" className="icon -back">
              Back
            </Link>
          }
        />

        <TokensList />

        <nav className="footer-nav">
          <div className="footer-nav_status">
            <Health />
          </div>
          <div className="footer-nav_icons">
            <button className="button -tiny" onClick={this.handleGoToWhitelist}>
              Add tokens
            </button>
          </div>
        </nav>
      </div>
    );
  }
}

export default Tokens;
// <button
//   className='icon -arrow'
//   onClick={this.toggleBackupScreen}>
//   Backup
// </button>
// {
//   toggleBackupScreen ?
//   <FetherForm.Field
//     label='Password'
//     onChange={this.handlePasswordChange}
//     required
//     type='password'
//     value={password}
//   /> :
//   null
// }
