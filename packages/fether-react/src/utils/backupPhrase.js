// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause
import * as CryptoJS from 'crypto-js';
import localForage from 'localforage';

/*
  Sets a flag in local storage to indicate that user has confirmed
  the account's recovery phrase has been copied somewhere safe.
*/
export const setAccountAsSafe = async (address, phrase, password) => {
  // unset account flag
  await localForage.removeItem(`__flagged_${address}`);

  // AES encrypt the phrase
  const encryptedPhrase = CryptoJS.AES.encrypt(phrase, password).toString();

  // set flag as safe
  await localForage.setItem(`__safe_${address}`, encryptedPhrase);
};

/*
  Attempts to decrypt and return the AES encrypted recovery phrase
  with the provided password.

  Throws if incorrect password.
*/
export const decryptPhrase = async (phrase, password) => {
  // decrypt the phrase
  var phraseInBytes = CryptoJS.AES.decrypt(phrase, password);
  // this will throw in the case of a wrong password
  var originalPhrase = phraseInBytes.toString(CryptoJS.enc.Utf8);

  /* sometimes CryptoJS will not throw on incorrect password,
     but instead output a valid but empty utf8 string.
     in this case, we manually throw an error. */

  if (!originalPhrase) {
    throw new Error('Incorrect password');
  } else {
    return originalPhrase;
  }
};

export const getAccountFlagStatus = async address => {
  const flaggedPhrase = await localForage.getItem(`__flagged_${address}`);
  const canViewRecoveryPhrase =
    (await localForage.getItem(`__safe_${address}`)) || (flaggedPhrase && true);

  return [canViewRecoveryPhrase, flaggedPhrase];
};
