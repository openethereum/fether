// Copyright 2015-2019 Parity Technologies (UK) Ltd.
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

const CopyContainer = ({
  address,
  children,
  i18n,
  packageNS,
  ...otherProps
}) => (
  <ClickToCopy
    i18n={i18n}
    label={i18n.t(`${packageNS}:ui.click_to_copy.card.label`)}
    packageNS={packageNS}
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
  i18n,
  name,
  packageNS,
  type,
  screen,
  shortAddress,
  ...otherProps
}) => (
  <Card {...otherProps}>
    {copyAddress ? (
      <CopyContainer address={address} i18n={i18n} packageNS={packageNS}>
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
  i18n: PropTypes.object,
  name: PropTypes.string,
  packageNS: PropTypes.string,
  screen: PropTypes.string,
  shortAddress: PropTypes.bool
};
