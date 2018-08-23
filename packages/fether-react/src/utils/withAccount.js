// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';

export default compose(
  withRouter,
  withProps(({ match: { params: { accountAddress } } }) => ({
    accountAddress
  }))
);
