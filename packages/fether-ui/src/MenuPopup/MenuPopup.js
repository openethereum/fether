// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import PropTypes from 'prop-types';
import { Popup as SUIPopup } from 'semantic-ui-react';

export const MenuPopup = ({ menuItems, ...otherProps }) => (
  <SUIPopup {...otherProps}>
    <div className='popup-screen'>
      <SUIPopup.Content>
        {menuItems &&
          menuItems.map(item => (
            <div
              className='popup-screen_item'
              key={item.name}
              onClick={item.onClick}
            >
              {item.name}
            </div>
          ))}
      </SUIPopup.Content>
    </div>
  </SUIPopup>
);

MenuPopup.defaultProps = {
  basic: true,
  horizontalOffset: 0,
  on: 'click',
  size: 'large'
};

MenuPopup.propTypes = {
  basic: PropTypes.bool, // toggles popup arrow
  className: PropTypes.string,
  horizontalOffset: PropTypes.number,
  menuItems: PropTypes.array.isRequired,
  on: PropTypes.string,
  size: PropTypes.string,
  trigger: PropTypes.node
};
