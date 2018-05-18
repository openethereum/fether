// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import { action, computed, observable } from 'mobx';
import store from 'store';

import ethereumIcon from '../assets/img/tokens/ethereum.png';
import parityStore from './parityStore';

const LS_PREFIX = '__paritylight::tokens';

class TokensStore {
  @observable tokens = new Map();

  constructor () {
    this.api = parityStore.api;

    if (parityStore.isApiConnected) {
      this.init();
    } else {
      // TODO This .on() is not working, so we poll every second
      // this.api.on('connected', this.init);
      this.interval = setInterval(() => {
        if (parityStore.isApiConnected) {
          this.init();
          clearInterval(this.interval);
        }
      }, 1000);
    }
  }

  @action
  addToken = (address, token) => {
    this.tokens.set(address, token);
    this.updateLS();
  };

  init = async () => {
    // Set the localStorage key, we have one key per chain, in this format:
    // __paritylight::tokens::kovan
    try {
      const chainName = await this.api.parity.chain();
      this.lsKey = `${LS_PREFIX}::${chainName}`;
    } catch (e) {
      console.error(e);
      // Fallback to main net
      this.lsKey = `${LS_PREFIX}::foundation`;
    }

    // Now we fetch the tokens from the localStorage
    const tokens = store.get(this.lsKey);
    if (!tokens) {
      // If there's nothing in the localStorage, we add be default only
      // Ethereum. We consider Ethereum as a token, with address 'ETH'
      this.addToken('ETH', {
        address: 'ETH',
        logo: ethereumIcon,
        name: 'Ethereum',
        symbol: 'ETH'
      });
    } else {
      this.tokens.replace(tokens);
    }
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

  updateLS = () => {
    if (!this.lsKey) {
      return;
    }
    store.set(this.lsKey, this.tokens);
  };
}

export default new TokensStore();
