// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import { action, computed, observable } from 'mobx';

import parityStore from './parityStore';

class SignerStore {
  @observable pending = [];

  constructor () {
    this.api = parityStore.api;

    if (parityStore.isApiConnected) {
      this.subscribePending();
    } else {
      // TODO This .on() is not working, so we poll every second
      // this.api.on('connected', this.subscribePending);
      this.interval = setInterval(() => {
        if (parityStore.isApiConnected && this.api) {
          this.subscribePending();
          clearInterval(this.interval);
        }
      }, 1000);
    }
  }

  acceptRequest = (requestId, password) =>
    this.api.signer.confirmRequest(requestId, null, password);

  rejectRequest = (requestId, password) =>
    this.api.signer.rejectRequest(requestId, null, password);

  @computed
  get requests () {
    const mapping = {}; // requestId -> request mapping
    this.pending.forEach(request => {
      mapping[request.id] = request;
    });
    return mapping;
  }

  @action
  setPending = (pending = []) => {
    this.pending = pending;
  };

  subscribePending = () => {
    const callback = (err, pending) => {
      if (err) {
        throw new Error(err);
      }

      this.setPending(pending);
    };

    this.api
      .subscribe('signer_requestsToConfirm', callback)
      .then(() => this.api.signer.requestsToConfirm())
      .then(pending => callback(null, pending))
      .catch(callback);
  };
}

export default new SignerStore();
