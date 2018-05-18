// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import { action, computed, observable } from 'mobx';
import store from 'store';

import ethereumIcon from '../assets/img/tokens/ethereum.png';

const LS_PREFIX = '__paritylight::';
const LS_KEY = `${LS_PREFIX}tokens`;

class TokensStore {
  @observable tokens = new Map();

  constructor () {
    const value = store.get(LS_KEY);

    if (!value) {
      // We consider Ethereum as a token, with address 'ETH'
      this.addToken('ETH', {
        address: 'ETH',
        logo: ethereumIcon,
        name: 'Ethereum',
        symbol: 'ETH'
      });
    } else {
      this.tokens.replace(value);
    }
  }

  @action
  addToken = (address, token) => {
    this.tokens.set(address, token);
    this.updateLS();
  };

  @action
  removeToken = address => {
    this.tokens.delete(address);
    this.updateLS();
  };

  @computed
  get tokensArray () {
    return Array.from(this.tokens.values());
  }

  @computed
  get tokensArrayWithoutEth () {
    return Array.from(this.tokens.values()).filter(
      ({ address }) => address !== 'ETH' // Ethereum is the only token without address, has 'ETH' instead
    );
  }

  updateLS = () => store.set(LS_KEY, this.tokens);
}

export default new TokensStore();
