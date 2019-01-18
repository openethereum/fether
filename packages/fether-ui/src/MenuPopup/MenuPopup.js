// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import PropTypes from 'prop-types';
import { Popup as SUIPopup } from 'semantic-ui-react';

export const MenuPopup = ({
  menuItems,
  onClose,
  onItemClick,
  open,
  ...otherProps
}) => (
  <SUIPopup onClose={(event, data) => onClose()} open={open} {...otherProps}>
    <div className='popup-screen'>
      <SUIPopup.Content>
        {menuItems &&
          menuItems.map(item => (
            <div
              className='popup-screen_item'
              key={item.name}
              onClick={() => onItemClick(item.url)}
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
  position: 'top right',
  size: 'large',
  verticalOffset: 0
};

MenuPopup.propTypes = {
  basic: PropTypes.bool, // toggles popup arrow
  className: PropTypes.string,
  context: PropTypes.any, // element to bind the popup to or use position
  horizontalOffset: PropTypes.number,
  hoverable: PropTypes.bool, // toggle autoclose
  menuItems: PropTypes.array.isRequired,
  on: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onItemClick: PropTypes.func,
  open: PropTypes.bool.isRequired,
  position: PropTypes.string,
  size: PropTypes.string,
  verticalOffset: PropTypes.number
};
