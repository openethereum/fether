// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import Blockies from 'react-blockies';
import PropTypes from 'prop-types';

import signerIcon from './signerIcon.png';
import { Placeholder } from '../../Placeholder';

export const Avatar = ({
  address,
  type,
  style,
  scale = 4,
  size = 8,
  ...otherProps
}) => (
  <div className='account_avatar' style={style}>
    {address ? (
      <figure style={{ margin: '0', position: 'relative' }}>
        <Blockies
          seed={address.toLowerCase()}
          scale={scale}
          size={size}
          {...otherProps}
        />
        {type === 'signer' && (
          <img
            src={signerIcon}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              height: size * scale * 0.5
            }}
          />
        )}
      </figure>
    ) : (
      <Placeholder height={size * scale} width={size * scale} />
    )}
  </div>
);

Avatar.propTypes = {
  address: PropTypes.string
};
