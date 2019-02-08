// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import PropTypes from 'prop-types';

import { AddressShort } from '../../AddressShort';
import { Placeholder } from '../../Placeholder';

export const Address = ({ address, shortAddress, ...otherProps }) => (
  <div
    className={`account_address ${!shortAddress ? '-narrow' : ''}`}
    {...otherProps}
  >
    {address ? (
      shortAddress ? (
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
  shortAddress: false
};

Address.propTypes = {
  name: PropTypes.string,
  shortAddress: PropTypes.bool
};
