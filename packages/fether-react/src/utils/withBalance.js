// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import abi from '@parity/contracts/lib/abi/eip20';
import { balanceOf$, makeContract, withoutLoading } from '@parity/light.js';
import branch from 'recompose/branch';
import compose from 'recompose/compose';
import { fromWei } from '@parity/api/lib/util/wei';
import light from '@parity/light.js-react';
import { map } from 'rxjs/operators';
import withProps from 'recompose/withProps';

export const withErc20Balance = light({
  erc20Balance: ({ token, accountAddress }) =>
    makeContract(token.address, abi)
      .balanceOf$(accountAddress)
      .pipe(
        withoutLoading(),
        map(value => value && value.div(10 ** token.decimals))
      )
});

export const withEthBalance = light({
  ethBalance: ({ accountAddress }) =>
    balanceOf$(accountAddress, { withoutLoading: true }).pipe(
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
