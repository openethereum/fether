// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import { action, observable } from 'mobx';
import store from 'store';

import ethereumIcon from '../assets/img/tokens/ethereum.png';

const LS_PREFIX = '__paritylight::';
const LS_KEY = `${LS_PREFIX}tokens`;

export default class TokensStore {
  @observable tokens = new Map();

  constructor () {
    const value = store.get(LS_KEY);

    if (!value) {
      this.addToken('ETH', {
        image: ethereumIcon,
        name: 'Ethereum',
        symbol: 'ETH'
      });
      // TODO Remove this testing values
      this.addToken('ABC', {
        image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
        name: 'Abc Token',
        symbol: 'ABC'
      });
      this.addToken('DEF', {
        image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
        name: 'Def Token',
        symbol: 'DEF'
      });
    } else {
      this.tokens.replace(value);
    }
  }

  @action
  addToken = (key, token) => {
    this.tokens.set(key, token);
    this.updateLS();
  };

  @action
  removeToken = key => {
    this.tokens.delete(key);
    this.updateLS();
  };

  updateLS = () => store.set(LS_KEY, this.tokens);
}
