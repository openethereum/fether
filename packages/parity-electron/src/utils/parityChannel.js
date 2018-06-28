// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

let parityChannel = 'beta'; // Fetch beta by default

/**
 * Set custom parity channel.
 *
 * @param {*} channel
 */
export const setParityChannel = channel => {
  parityChannel = channel;
};

export default () => parityChannel;
