// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import { Provider, subscribe } from 'react-contextual';

export const consumeAccount = subscribe('account');

export const provideAccount = getAccountAddress => Component => props => {
  return (
    <Provider id='account' accountAddress={getAccountAddress(props)}>
      <Component {...props} />
    </Provider>
  );
};
