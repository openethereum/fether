// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose, mapProps } from 'recompose';
import { startWith } from 'rxjs/operators';
import light from '@parity/light.js-react';

import { transactionCountOf$, withoutLoading } from '@parity/light.js';
import withAccountsInfo from '../utils/withAccountsInfo';

const WithAccount = compose(
  withRouter,
  withAccountsInfo,
  light({
    transactionCount: props =>
      transactionCountOf$(props.match.params.accountAddress).pipe(
        startWith(undefined),
        withoutLoading()
      )
  }),
  mapProps(
    ({
      transactionCount,
      match: {
        params: { accountAddress }
      },
      accountsInfo,
      ...otherProps
    }) => ({
      account: {
        address: accountAddress,
        name: accountsInfo[accountAddress].name,
        type: accountsInfo[accountAddress].type,
        transactionCount
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
