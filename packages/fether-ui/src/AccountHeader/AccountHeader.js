// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import Blockies from 'react-blockies';
import PropTypes from 'prop-types';

import ClickToCopy from '../ClickToCopy';
import Header from '../Header';

const NormalContainer = ({ children }) => (
  <h1 className='account'>{children}</h1>
);
const CopyContainer = ({ address, children, ...otherProps }) => (
  <ClickToCopy label='Copy address' textToCopy={address} {...otherProps}>
    <a className='account'>{children}</a>
  </ClickToCopy>
);

const AccountHeader = ({ address, copyAddress, name, ...otherProps }) => {
  const Container = copyAddress ? CopyContainer : NormalContainer;

  return (
    <div>
      <Header
        title={
          address &&
          name && (
            <Container address={address}>
              <Blockies seed={address.toLowerCase()} scale={2} size={8} />{' '}
              {name}{' '}
              <span className='account_address'>
                {address.slice(0, 4)}..{address.slice(-4)}
              </span>
            </Container>
          )
        }
        {...otherProps}
      />
    </div>
  );
};

AccountHeader.propTypes = {
  address: PropTypes.string,
  name: PropTypes.string
};

export default AccountHeader;
