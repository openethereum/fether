// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import PropTypes from 'prop-types';
import { Clickable, ClickToCopy } from 'fether-ui';

import { Address } from './Address';
import { Avatar } from './Avatar';
import { Card } from '../Card';
import { Information } from './Information';
import { Name } from './Name';

const CopyContainer = ({ address, children, ...otherProps }) => (
  <ClickToCopy
    label='Click to copy address'
    textToCopy={address}
    {...otherProps}
  >
    <Clickable>{children}</Clickable>
  </ClickToCopy>
);

const CardContents = ({ address, name, shortAddress, type }) => (
  <div className='account'>
    <Avatar address={address} type={type} />
    <Information>
      <Name name={name} />
      <Address address={address} shortAddress={shortAddress} />
    </Information>
  </div>
);

export const AccountCard = ({
  address,
  copyAddress,
  name,
  type,
  screen,
  shortAddress,
  ...otherProps
}) => (
  <Card {...otherProps}>
    {copyAddress ? (
      <CopyContainer address={address}>
        <CardContents
          address={address}
          name={name}
          shortAddress={shortAddress}
          type={type}
        />
      </CopyContainer>
    ) : (
      <CardContents
        address={address}
        name={name}
        shortAddress={shortAddress}
        type={type}
      />
    )}
  </Card>
);

AccountCard.Address = Address;
AccountCard.Avatar = Avatar;
AccountCard.Information = Information;
AccountCard.Name = Name;

AccountCard.propTypes = {
  address: PropTypes.string,
  copyAddress: PropTypes.bool,
  drawers: PropTypes.arrayOf(PropTypes.node),
  name: PropTypes.string,
  screen: PropTypes.string,
  shortAddress: PropTypes.bool
};
