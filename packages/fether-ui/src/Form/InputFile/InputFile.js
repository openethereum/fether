// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';

export class InputFile extends React.PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    onChangeFile: PropTypes.func.isRequired,
    required: PropTypes.bool,
    value: PropTypes.any
  };

  state = {
    file: {
      name: '',
      size: 0
    }
  };

  onDropRejected = () => {
    console.log(
      'The file you uploaded was rejected. Please make sure this is the actual keyfile generated from a wallet'
    );
  };

  onDrop = files => {
    const { onChangeFile } = this.props;

    files.forEach(file => {
      const reader = new window.FileReader();

      reader.onabort = () => {
        // ignore
      };

      reader.onerror = () => {
        // ignore
      };

      reader.onload = evt => {
        const data = evt.target.result;

        onChangeFile && onChangeFile(evt);

        this.setState({
          file: {
            name: file.name,
            size: data.length
          }
        });
      };

      reader.readAsText(file);
    });
  };

  render () {
    const acceptedFormats = ['application/json', 'text/plain'].join(', ');

    const { label } = this.props;

    return (
      <Dropzone
        accept={acceptedFormats}
        className='form_field'
        disabled={false}
        multiple={false}
        onDrop={this.onDrop}
        onDropRejected={this.onDropRejected}
        disableClick
      >
        {({ open }) => (
          <div className='dropzone -md'>
            <label htmlFor='backupKeyfile'>{label}</label>
            <button type='button' className='button' onClick={() => open()}>
              Select File
            </button>
          </div>
        )}
      </Dropzone>
    );
  }
}
