// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';

import SignerList from './SignerList';

class Signer extends Component {
  render() {
    return (
      <div>
        <SignerList />
      </div>
    );
  }
}

export default Signer;
