// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import SignerDetails from './SignerDetails';
import SignerList from './SignerList';

class Signer extends Component {
  render() {
    return (
      <div>
        <SignerList />
        <hr />
        <Route path="/signer/:requestId" component={SignerDetails} />
      </div>
    );
  }
}

export default Signer;
