// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { chainId$, chainName$, withoutLoading } from '@parity/light.js';
import { startWith } from 'rxjs/operators';
import { compose } from 'recompose';
import light from '@parity/light.js-react';

const withChainInfo = compose(
  light({
    chainId: () =>
      chainId$().pipe(
        withoutLoading(),
        startWith(undefined) // This will allow showing the component immediately, so no blank screen
      ),
    chainName: () =>
      chainName$().pipe(
        withoutLoading(),
        startWith(undefined) // This will allow showing the component immediately, so no blank screen
      )
  })
);

export default withChainInfo;
