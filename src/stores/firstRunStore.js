// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import { action, observable } from 'mobx';
import store from 'store';

import LS_PREFIX from './utils/lsPrefix';

const LS_KEY = `${LS_PREFIX}::firstRun`;

class OnboardingStore {
  @observable isFirstRun;

  constructor () {
    const isFirstRun = store.get(LS_KEY);
    if (isFirstRun === undefined) {
      // Set store property to true.
      this.setIsFirstRun(true);
      // Set localStorage to false, so that next time, isFirstRun will be
      // false.
      this.updateLS();
    } else {
      this.setIsFirstRun(isFirstRun);
    }
  }

  @action setIsFirstRun = isFirstRun => (this.isFirstRun = isFirstRun);

  updateLS = () => store.set(LS_KEY, false);
}

export default new OnboardingStore();
