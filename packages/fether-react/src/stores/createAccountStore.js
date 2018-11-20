// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { action, observable } from "mobx";

import Debug from "../utils/debug";
import parityStore from "./parityStore";
import FileSaver from "file-saver";

const debug = Debug("createAccountStore");

export class CreateAccountStore {
  @observable
  address = null;
  @observable
  json = {};
  @observable
  isImport = false; // Are we creating a new account, or importing via phrase?
  @observable
  isJSON = false; // Are we recovering an account from a JSON backup file/
  @observable
  name = ""; // Account name
  @observable
  phrase = null; // The 12-word seed phrase

  /**
   * Reinitialize everything
   */
  clear() {
    this.setPhrase(null);
    this.setName("");
  }

  backupAccount = (address, password) => {
    debug("Generating Backup JSON");

    return parityStore.api.parity
      .exportAccount(address, password)
      .then(res => {
        console.log("good, ", res);

        const blob = new Blob([JSON.stringify(res)], {
          type: "application/json; charset=utf-8"
        });

        console.log(blob);
        FileSaver.saveAs(blob, `${res.address}.json`);
      })
      .catch(err => {
        console.error("bad, ", err);
        return err;
      });
  };

  generateNewAccount = () => {
    debug("Generating new account.");
    return this.setPhrase(null)
      .then(() => parityStore.api.parity.generateSecretPhrase())
      .then(this.setPhrase);
  };

  saveAccountToParity = password => {
    debug("Saving account to Parity.");
    console.log(this.phrase);
    return parityStore.api.parity
      .newAccountFromPhrase(this.phrase, password)
      .then(() =>
        parityStore.api.parity.setAccountName(this.address, this.name)
      )
      .then(() =>
        parityStore.api.parity.setAccountMeta(this.address, {
          timestamp: Date.now()
        })
      );
  };

  @action
  setAddress = address => {
    this.address = address;
  };

  @action
  setJSON = json => {
    this.json = json;
  };

  @action
  setIsImport = isImport => {
    this.isImport = isImport;
  };

  @action
  setIsJSON = isJSON => {
    this.isJSON = isJSON;
  };

  @action
  setName = name => {
    this.name = name;
  };

  /**
   * Set phrase and corresponding address
   */
  @action
  setPhrase = phrase => {
    this.phrase = phrase;
    this.address = null;

    if (!phrase) return Promise.resolve();
    else {
      return parityStore.api.parity
        .phraseToAddress(phrase)
        .then(address => this.setAddress(address));
    }
  };
}

export default new CreateAccountStore();
