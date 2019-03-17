// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { accountsInfo$, withoutLoading } from '@parity/light.js';
import { compose, mapPropsStream } from 'recompose';
import keyBy from 'lodash/keyBy';
import light from '@parity/light.js-react';
import { map, switchMap } from 'rxjs/operators';

import localForage$ from './localForage';

import { SIGNER_ACCOUNTS_LS_KEY } from '../stores/createAccountStore';

/**
 * HOC which injects the node's accounts as well as the Parity Signer accounts,
 * the latter being stored in local storage.
 */
const withAccountsInfo = compose(
  light({
    accountsInfo: () => accountsInfo$().pipe(withoutLoading())
  }),
  // mapPropsStream and add localForage$
  mapPropsStream(
    switchMap(({ accountsInfo: nodeAccountsInfo, ...props }) => {
      return localForage$(SIGNER_ACCOUNTS_LS_KEY).pipe(
        map(paritySignerAccounts => {
          const paritySignerAccountsInfo = keyBy(
            paritySignerAccounts,
            'address'
          );
          Object.keys(nodeAccountsInfo).forEach(address => {
            nodeAccountsInfo[address].type = 'node';
          });
          Object.keys(paritySignerAccountsInfo).forEach(address => {
            paritySignerAccountsInfo[address].type = 'signer';
          });
          return {
            ...props,
            accountsInfo: { ...paritySignerAccountsInfo, ...nodeAccountsInfo }
          };
        })
      );
    })
  )
);

export default withAccountsInfo;
