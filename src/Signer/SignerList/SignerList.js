// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { fromWei } from '@parity/api/lib/util/wei';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

@inject('signerStore')
@observer
class SignerList extends Component {
  render () {
    const {
      signerStore: { pending }
    } = this.props;
    return (
      <div>
        List of requests to be signed (click to sign):<ul>
          {pending.map(({ id, payload: { sendTransaction: { value } } }) => (
            <li key={+id}>
              {/* TODO inline style is bad */}
              <Link
                to={`/signer/${id.toString(16)}`}
                style={{ color: 'white' }}
              >
                - The one with {+fromWei(value)}ETH (show to? from?)
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default SignerList;
