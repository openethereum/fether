// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import PropTypes from 'prop-types';
import { Button as SUIButton, Popup as SUIPopup } from 'semantic-ui-react';

export const MenuPopup = ({
  basic,
  className,
  context,
  handleGoToLink,
  horizontalOffset,
  hoverable,
  menuItems,
  on,
  onClose,
  open,
  position,
  size,
  verticalOffset
}) => (
  <SUIPopup
    basic={basic || true} // toggles popup arrow
    className={className}
    context={context} // element to bind the popup to or use position
    handleGoToLink={handleGoToLink}
    horizontalOffset={horizontalOffset || 0}
    hoverable={hoverable}
    keepInViewPort
    on={on || 'click'}
    onClose={(event, data) => onClose()}
    open={open}
    position={position || 'top right'}
    size={size || 'large'}
    verticalOffset={verticalOffset || 0}
  >
    <div className='popup-screen'>
      <SUIPopup.Content>
        {menuItems &&
          menuItems.map(item => (
            <SUIButton
              className='popup-screen_button'
              key={item.name}
              onClick={() => handleGoToLink(item.url)}
            >
              {item.name}
            </SUIButton>
          ))}
      </SUIPopup.Content>
    </div>
  </SUIPopup>
);

MenuPopup.propTypes = {
  basic: PropTypes.bool,
  className: PropTypes.string,
  context: PropTypes.any,
  handleGoToLink: PropTypes.func,
  horizontalOffset: PropTypes.number,
  hoverable: PropTypes.bool,
  menuItems: PropTypes.array.isRequired,
  on: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  position: PropTypes.string,
  size: PropTypes.string,
  verticalOffset: PropTypes.number
};
