// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from "react";

// Shape of the default value needs to match the shape that the consumers expect
export const AccountContext = React.createContext({
  accountAddress: null
});

export const consumeAccount = Component => props => (
  <AccountContext.Consumer>
    {contextValues => {
      console.log("consumer function, contextvalues:", contextValues);
      return <Component {...contextValues} />;
    }}
  </AccountContext.Consumer>
);

export const provideAccount = getAccountAddress => Component => props => {
  console.log("provider get account address returns", getAccountAddress(props));
  return (
    <AccountContext.Provider
      value={{ accountAddress: getAccountAddress(props) }}
    >
      <Component {...props} />
    </AccountContext.Provider>
  );
};
