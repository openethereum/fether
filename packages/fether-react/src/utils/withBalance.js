// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import abi from '@parity/shared/lib/contracts/abi/eip20';
import branch from 'recompose/branch';
import compose from 'recompose/compose';
import { balanceOf$, isNullOrLoading, makeContract } from '@parity/light.js';
import { map } from 'rxjs/operators';
import { fromWei } from '@parity/api/lib/util/wei';
import light from 'light-hoc';
import withProps from 'recompose/withProps';

export const withErc20Balance = light({
  erc20Balance: ({ token, accountAddress }) =>
    makeContract(token.address, abi)
      .balanceOf$(accountAddress)
      .pipe(
        map(value => (isNullOrLoading(value) ? null : value)), // Transform loading state to null
        map(value => value && value.div(10 ** token.decimals))
      )
});

export const withEthBalance = light({
  ethBalance: ({ accountAddress }) =>
    balanceOf$(accountAddress).pipe(
      map(value => (isNullOrLoading(value) ? null : value)), // Transform loading state to null
      map(value => value && fromWei(value))
    )
});

/**
 * A HOC on light.js to get the current balance. The inner component needs to
 * have a `token` field and a `accountAddress` field in its props.
 *
 * @example
 * @withBalance
 * class MyComponent extends React.Component{
 *
 * }
 */
export default compose(
  branch(
    ({ token }) => token && token.address && token.address !== 'ETH',
    withErc20Balance,
    withEthBalance
  ),
  withProps(props => ({
    balance: props.erc20Balance || props.ethBalance
  }))
);
