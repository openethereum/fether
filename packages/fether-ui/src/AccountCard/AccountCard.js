// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import PropTypes from 'prop-types';

import { Address } from './Address';
import { Avatar } from './Avatar';
import { Card } from '../Card';
import { Information } from './Information';
import { Name } from './Name';

export const AccountCard = ({
  address,
  name,
  type,
  shortAddress,
  ...otherProps
}) => (
  <Card {...otherProps}>
    <div className='account'>
      <Avatar address={address} type={type} />
      <Information>
        <Name name={name} />
        <Address address={address} short={shortAddress} />
      </Information>
    </div>
  </Card>
);

AccountCard.Address = Address;
AccountCard.Avatar = Avatar;
AccountCard.Information = Information;
AccountCard.Name = Name;

AccountCard.propTypes = {
  address: PropTypes.string,
  name: PropTypes.string,
  shortAddress: PropTypes.bool
};
