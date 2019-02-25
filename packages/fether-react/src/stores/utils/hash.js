// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

/*
  Quick and dirty hashing function for checking encrypt/decrypt results from Crypto-js.
  32 bit limitation means there's a 50% chance of collision after 77,0000 hashes.
  This doesn't matter for our case since it's just for a sanity check of the third party
  encryption library.
*/
export const hashString = str => {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
};
