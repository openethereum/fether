// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { PureComponent } from "react";
import { AccountHeader } from "fether-ui";
import { accountsInfo$ } from "@parity/light.js";
import light from "@parity/light.js-react";
import { Link, Redirect, withRouter } from "react-router-dom";

import Health from "../Health";
import TokensList from "./TokensList";

import { provideTokens } from "../contexts/TokensContext.js";
import withAccount from "../utils/withAccount.js";

@withRouter
@withAccount
@light({
  accountsInfo: accountsInfo$
})
class Tokens extends PureComponent {
  handleGoToWhitelist = () => {
    this.props.history.push(`/whitelist/${this.props.accountAddress}`);
  };

  render() {
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
