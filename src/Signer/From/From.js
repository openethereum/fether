// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

@inject('signerStore')
@observer
class Signer extends Component {
  render() {
    const { signerStore } = this.props;
    console.log(signerStore);
    return <div />;
  }
}

export default Signer;
