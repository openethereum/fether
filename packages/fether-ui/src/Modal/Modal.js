// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import PropTypes from 'prop-types';

class Modal extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
  };

  constructor (props) {
    super(props);

    this.modalRef = React.createRef();
    this.modalCloseOverlayRef = React.createRef();
    this.state = {
      open: false
    };
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.open !== prevState.open) {
      return {
        open: nextProps.open
      };
    }

    // No state update necessary
    return null;
  }

  componentDidMount () {
    const modalCloseOverlayRef = this.modalCloseOverlayRef.current;

    modalCloseOverlayRef.addEventListener('mouseup', this.handleClose);
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.open === false) {
      this.handleOpen();
    }
  }

  componentWillUnmount () {
    const modalCloseOverlayRef = this.modalCloseOverlayRef.current;

    modalCloseOverlayRef.addEventListener('mouseup', this.handleClose);
  }

  handleOpen = () => {
    const modalRef = this.modalRef.current;
    const modalCloseOverlayRef = this.modalCloseOverlayRef.current;

    modalRef.style.display = 'block';
    modalCloseOverlayRef.style.display = 'block';
  };

  handleClose = () => {
    const { onClose } = this.props;
    const modalRef = this.modalRef.current;
    const modalCloseOverlayRef = this.modalCloseOverlayRef.current;

    modalRef.style.display = 'none';
    modalCloseOverlayRef.style.display = 'none';

    onClose();
  };

  render () {
    const { children } = this.props;

    return (
      <div className='modal-wrapper'>
        <div className='modal-close' ref={this.modalCloseOverlayRef} />
        <div className='modal' ref={this.modalRef}>
          {children}
        </div>
      </div>
    );
  }
}

export { Modal };
