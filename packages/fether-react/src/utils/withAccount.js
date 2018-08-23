// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import { withRouter } from 'react-router-dom';

const AccountAddressFromRouter = withRouter(props =>
  props.children(props.match.params.accountAddress)
);

// We don't want to pass the router props to the returned component
export default Component => initialProps => {
  return (
    <AccountAddressFromRouter>
      {accountAddress => (
        <Component accountAddress={accountAddress} {...initialProps} />
      )}
    </AccountAddressFromRouter>
  );
};
