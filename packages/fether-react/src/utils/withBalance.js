// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import abi from '@parity/contracts/lib/abi/eip20';
import { balanceOf$, makeContract } from '@parity/light.js';
import branch from 'recompose/branch';
import compose from 'recompose/compose';
import { fromWei } from '@parity/api/lib/util/wei';
import light from '@parity/light.js-react';
import { map, startWith } from 'rxjs/operators';
import withProps from 'recompose/withProps';

export const withErc20Balance = light({
  erc20Balance: ({ token, account: { address } }) =>
    makeContract(token.address, abi)
      .balanceOf$(address)
      .pipe(
        map(value => value && value.div(10 ** token.decimals)),
        startWith(undefined)
      )
});

// `withEthBalance` is either the ETH or the ETC balance, as it depends
// on what chain they are currently connected to.
export const withEthBalance = light({
  ethBalance: ({ account: { address } }) =>
    balanceOf$(address).pipe(
      map(value => value && fromWei(value)),
      startWith(undefined)
    )
});

/**
 * A HOC on light.js to get the current balance of the account.
 *
 * The component needs to receive a `token` prop as well as an
 * `account: {address}` prop (i.e. needs to be decorated with withAccount).
 *
 * @example
 * @withAccount
 * @withBalance
 * class MyComponent extends React.Component{
 *
 * }
 */
export default compose(
  branch(
    ({ token }) =>
      token &&
      token.address &&
      token.address !== 'ETH' &&
      token.address !== 'ETC',
    withErc20Balance,
    withEthBalance
  ),
  withProps(props => ({
    balance: props.erc20Balance || props.ethBalance
  }))
);
