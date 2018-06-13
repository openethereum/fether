// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Blockies from 'react-blockies';
import PropTypes from 'prop-types';

import Card from '../Card';
import Placeholder from '../Placeholder';

const AccountCard = ({ address, name, ...otherProps }) => (
  <Card {...otherProps}>
    <div className='account'>
      <div className='account_avatar'>
        {address ? (
          <Blockies seed={address.toLowerCase()} />
        ) : (
          <Placeholder height={36} width={36} />
        )}
      </div>
      <div className='account_information'>
        {name ? (
          <div className='account_name'>{name}</div>
        ) : (
          <Placeholder height={18} width={100} />
        )}
        <div className='account_address'>
          {address || <Placeholder height={14} width={150} />}
        </div>
      </div>
    </div>
  </Card>
);

AccountCard.propTypes = {
  address: PropTypes.string,
  name: PropTypes.string
};

export default AccountCard;
