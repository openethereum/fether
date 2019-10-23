// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

import * as postMessage from './postMessage';
import EventEmitter from 'eventemitter3';

export default class PostMessageProvider extends EventEmitter {
  constructor (destination) {
    super();

    this._destination = destination || window.parent;

    this._id = 1;
    this._messages = {};
    this._subscriptionsToId = {};

    this._receiveMessage = this._receiveMessage.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);

    postMessage.listen$('RPC_RESPONSE').subscribe(this._receiveMessage);
  }

  _constructMessage (id, data) {
    return Object.assign({}, data, {
      id,
      to: 'shell'
    });
  }

  _send (message, meta) {
    const { method, params } = message;
    const id = this._id++;

    const raw = JSON.stringify({
      jsonrpc: '2.0',
      id,
      method,
      params
    });

    postMessage.send('RPC_REQUEST', raw);

    this._messages[id] = meta;
  }

  send (method, params, callback) {
    return new Promise((resolve, reject) => {
      this._send(
        {
          method,
          params
        },
        {
          resolve: (...argz) => {
            resolve(...argz);
            callback(null, ...argz);
          },
          reject: err => {
            reject(err);
            callback(err);
          }
        }
      );
    });
  }

  _methodsFromApi (api) {
    if (api.subscription) {
      const { subscribe, unsubscribe, subscription } = api;

      return {
        method: subscribe,
        uMethod: unsubscribe,
        subscription
      };
    }

    return {
      method: `${api}_subscribe`,
      uMethod: `${api}_unsubscribe`,
      subscription: `${api}_subscription`
    };
  }

  subscribe (api, callback, params) {
    return new Promise((resolve, reject) => {
      const mf = this._methodsFromApi(api);

      this._send(
        {
          method: mf.method,
          params
        },
        {
          method: mf.method,
          uMethod: mf.uMethod,
          subscription: mf.subscription,
          resolve,
          reject,
          callback
        }
      );
    });
  }

  unsubscribe (subId) {
    return new Promise((resolve, reject) => {
      this._send(
        {
          method: this._messages[subId].uMethod,
          params: [subId]
        },
        {
          resolve: v => {
            delete this._messages[subId];
            resolve(v);
          },
          reject
        }
      );
    });
  }

  _receiveMessage (raw) {
    // FIXME I'm not sure how to fix this
    // I had some occasions where it cannot parse
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.warn(`Cannot parse ${raw}. Ignoring message.`);

      return;
    }

    const { id, error } = parsed;
    const subscription = parsed.params && parsed.params.subscription;

    if (subscription) {
      // subscription notification
      const result = parsed.params.result;
      let messageId = this._subscriptionsToId[subscription];

      // FIXME I'm not sure how to fix this
      // Sometimes we receive results for a subscription that we have never
      // seen before. Ignore.
      if (!this._messages[messageId]) {
        console.warn(`Got result for unknown subscription ${subscription}`);

        return;
      }

      this._messages[messageId].callback(
        error && new Error(error.message),
        result
      );
    } else {
      // FIXME I'm not sure how to fix this
      // Sometimes we receive results for an id that we have never seen before.
      // Ignore.
      if (!this._messages[id]) {
        console.warn(`Got result for unknown id ${id}`);

        return;
      }

      // request response
      const result = parsed.result;
      if (error) {
        this._messages[id].reject(new Error(error.message));
      } else {
        this._messages[id].resolve(result);

        // if this is a response to a subscription request, we store the mapping
        // between request id & subscription id
        if (this._messages[id].subscription) {
          this._subscriptionsToId[result] = id;
        } else {
          delete this._messages[id];
        }
      }
    }
  }
}
