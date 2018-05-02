// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// SPDX-License-Identifier: MIT

import priotization from '../priotization';

// Mapping of subscribed
const subscribed = {};

/**
 * Add an Observable from the rpc/ folder into the subscribed object.
 * This function should be called every time an Observable is subscribed to.
 */
export const addSubscribedRpc = rpc => {
  subscribed[rpc] = priotization[rpc].metadata.name;
};

/**
 * Add a property on window, so that the subscribed object can be viewed in the
 * JS console via `window.parity.rpcOverview()`
 */
if (typeof window !== 'undefined') {
  window.parity = {
    rpcOverview () {
      return subscribed;
    }
  };
}

export default subscribed;
