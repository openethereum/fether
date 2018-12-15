// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose, mapProps } from 'recompose';
import light from '@parity/light.js-react';

import { transactionCountOf$, withoutLoading } from '@parity/light.js';
import withAccountsInfo from '../utils/withAccountsInfo';

const AccountAddressFromRouter = withRouter(props =>
  props.children(props.match.params.accountAddress)
);

// We do not want to pass the router props nor the accountsInfo props, both
// used internally, down to the component returned by withAccount.
export default Component =>
  withAccountsInfo(({ accountsInfo, ...initialProps }) => {
    return (
      <AccountAddressFromRouter>
        {accountAddress => {
          const DecoratedComponent = compose(
            light({
              transactionCount: () =>
                transactionCountOf$(accountAddress).pipe(withoutLoading())
            }),
            mapProps(({ transactionCount, account, ...otherProps }) => ({
              account: { transactionCount, ...account },
              ...otherProps
            }))
          )(Component);

          return (
            <DecoratedComponent
              account={{
                address: accountAddress,
                name: accountsInfo[accountAddress].name,
                type: accountsInfo[accountAddress].type
              }}
              {...initialProps}
            />
          );
        }}
      </AccountAddressFromRouter>
    );
  });
