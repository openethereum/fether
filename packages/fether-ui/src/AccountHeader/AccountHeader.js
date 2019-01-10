// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import Blockies from 'react-blockies';
import PropTypes from 'prop-types';

import { Clickable } from '../Clickable';
import { ClickToCopy } from '../ClickToCopy';
import { Header } from '../Header';

const NormalContainer = ({ children }) => (
  <h1 className='account -header'>{children}</h1>
);
const CopyContainer = ({ address, children, ...otherProps }) => (
  <ClickToCopy label='Copy address' textToCopy={address} {...otherProps}>
    <Clickable className='account -header'>{children}</Clickable>
  </ClickToCopy>
);

export const AccountHeader = ({
  address,
  copyAddress,
  name,
  ...otherProps
}) => {
  const Container = copyAddress ? CopyContainer : NormalContainer;

  return (
    <div>
      <Header
        title={
          address &&
          name && (
            <Container address={address}>
              <Blockies seed={address.toLowerCase()} scale={2} size={8} />{' '}
              {name} <br />
              <span className='account_address'>{address}</span>
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
