// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { transactionCountOf$, withoutLoading } from '@parity/light.js';
import { startWith } from 'rxjs/operators';
import { compose } from 'recompose';
import light from '@parity/light.js-react';
import withAccount from './withAccount';

const withTxCount = compose(
  withAccount,
  light({
    transactionCount: ({ account: { address } }) =>
      transactionCountOf$(address).pipe(
        withoutLoading(),
        startWith(undefined) // This will allow showing the component immediately, so no blank screen
      )
  })
);

export default withTxCount;
