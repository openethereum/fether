// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { withProps } from 'recompose';

// react-router doesn't pass match params to child components
export const consumeAccount = withProps(({ match: { url } }) => ({
  accountAddress: /^\/?tokens\/([^/]+)/.exec(url)[1]
}));
