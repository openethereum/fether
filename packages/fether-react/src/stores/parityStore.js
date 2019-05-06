// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { action, observable } from 'mobx';
import Api from '@parity/api';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import light from '@parity/light.js';
import localForage from 'localforage';
import { of, timer, zip } from 'rxjs';

import Debug from '../utils/debug';
import LS_PREFIX from './utils/lsPrefix';
import * as postMessage from '../utils/postMessage';

const debug = Debug('parityStore');

const LS_KEY = `${LS_PREFIX}::secureToken`;

export class ParityStore {
  // TODO This is not working
  // api.on('connected', () => ...);
  // api.on('disconnected', () => ...);
  // So instead, we poll every 1s
  isApiConnected$ = timer(0, 1000).pipe(
    map(_ => Boolean(this.api && this.api.isConnected)),
    distinctUntilChanged()
  );

  @observable
  api = undefined;

  constructor () {
    postMessage.send('WS_INTERFACE_REQUEST');
    postMessage.send('WS_PORT_REQUEST');

    // Use localForage.getItem instead of localForage$ here because localForage$
    // doesn't fire initial value if key is inexistant in local storage.
    localForage
      .getItem(LS_KEY)
      .then(lsToken => {
        const token$ = lsToken
          ? of(lsToken).pipe(tap(() => debug('Got token from localStorage.')))
          : this.requestNewToken$();

        zip(
          token$,
          postMessage.listen$('WS_INTERFACE_RESPONSE'),
          postMessage.listen$('WS_PORT_RESPONSE')
        ).subscribe(([token, wsInterface, wsPort]) =>
          this.connectToApi(token, wsInterface, wsPort)
        );
      })
      .catch(err =>
        console.error("Can't fetch localStorage with localForage.getItem,", err)
      );
  }

  connectToApi (token, wsInterface, wsPort) {
    // Get the provider, optionally from --ws-interface and --ws-port flags
    let provider = `ws://${wsInterface}:${wsPort}`;

    debug(`Connecting to ${provider}.`);
    const api = new Api(
      // FIXME - change to WsSecure when implement `wss` and security certificates
      new Api.Provider.Ws(
        provider,
        token.replace(/[^a-zA-Z0-9]/g, '') // Sanitize token
      )
    );

    // Initialize the light.js lib
    light.setApi(api);

    // Also set api as member for React Components to use it if needed
    this.api = api;
  }

  requestNewToken$ () {
    // Request new token from Electron
    debug('Requesting new token.');
    postMessage.send('SIGNER_NEW_TOKEN_REQUEST');
    return postMessage.listen$('SIGNER_NEW_TOKEN_RESPONSE').pipe(
      tap(() => debug('Successfully received new token.')),
      tap(this.updateLS)
    );
  }

  @action
  updateLS = token => {
    localForage.setItem(LS_KEY, token);
  };
}

export default new ParityStore();
