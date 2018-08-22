// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';

// react-router doesn't pass match params to child components
export const consumeAccount = compose(
  withRouter,
  withProps(({ match: { url } }) => ({
    accountAddress: /^\/?tokens\/([^/]+)/.exec(url)[1]
  }))
);
