// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Blockies from 'react-blockies';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

import Header from '../Header';

const NormalContainer = ({ children }) => (
  <h1 className='account'>{children}</h1>
);
const CopyContainer = ({ address, children, ...otherProps }) => (
  <CopyToClipboard text={address}>
    <a className='account' data-tip='Copy address'>
      {children}
      <ReactTooltip
        effect='solid'
        event='mouseover'
        eventOff='mouseout click'
        place='bottom'
      />
    </a>
  </CopyToClipboard>
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
                {address.slice(0, 4)}..{address.slice(-2)}
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
