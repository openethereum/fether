// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import abi from '@parity/shared/lib/contracts/abi/eip20';
import { empty } from 'rxjs';
import {
  defaultAccount$,
  isNullOrLoading,
  makeContract$,
  myBalance$
} from '@parity/light.js';
import { filter, map, switchMap } from 'rxjs/operators';
import { fromWei } from '@parity/api/lib/util/wei';
import light from 'light-hoc';

/**
 * A HOC on light.js to get the current balance. The inner component needs to
 * have a `token` field in its props.
 *
 * @example
 * @withBalance
 * class MyComponent extends React.Component{
 *
 * }
 */
export default light({
  balance: ownProps => {
    // Find our token object in the props
    const { token } = ownProps;

    if (!token || !token.address) {
      return empty();
    }
    return token.address === 'ETH'
      ? myBalance$().pipe(
        map(value => (isNullOrLoading(value) ? null : value)), // Transform loading state to null
        map(value => value && fromWei(value))
      )
      : defaultAccount$().pipe(
        filter(x => x),
        switchMap(defaultAccount =>
          makeContract$(token.address, abi).balanceOf$(defaultAccount)
        ),
        map(value => (isNullOrLoading(value) ? null : value)), // Transform loading state to null
        map(value => value && value.div(10 ** token.decimals))
      );
  }
});
