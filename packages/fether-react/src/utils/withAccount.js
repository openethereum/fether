// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose, mapProps } from 'recompose';

import withAccountsInfo from '../utils/withAccountsInfo';

const WithAccount = compose(
  withRouter,
  withAccountsInfo,
  mapProps(
    ({
      match: {
        params: { accountAddress }
      },
      accountsInfo,
      ...otherProps
    }) => ({
      account: {
        address: accountAddress,
        name: accountsInfo[accountAddress].name,
        type: accountsInfo[accountAddress].type
      },
      ...otherProps
    })
  )
)(props => props.children(props.account));

export default Component => initialProps => (
  <WithAccount>
    {account => <Component {...initialProps} account={account} />}
  </WithAccount>
);
