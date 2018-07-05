// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import PropTypes from 'prop-types';

import { AddressShort } from '../../AddressShort';
import { Placeholder } from '../../Placeholder';

export const Address = ({ address, short, ...otherProps }) => (
  <div className='account_address' {...otherProps}>
    {address ? (
      short ? (
        <AddressShort address={address} />
      ) : (
        address
      )
    ) : (
      <Placeholder height={14} width={100} />
    )}
  </div>
);

Address.defaultProps = {
  short: false
};

Address.propTypes = {
  name: PropTypes.string,
  short: PropTypes.bool
};
