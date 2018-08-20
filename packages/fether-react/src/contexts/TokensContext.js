// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from "react";
import { chainName$ } from "@parity/light.js";
import store from "store";
import { Provider, subscribe } from "react-contextual";
import { withProps } from "recompose";

import ethereumIcon from "../assets/img/tokens/ethereum.png";
import LS_PREFIX from "../stores/utils/lsPrefix";

import Debug from "../utils/debug";

const debug = Debug("TokensContext");

const LS_KEY = `${LS_PREFIX}::tokens`;

const DEFAULT_TOKENS = {
  ETH: {
    address: "ETH",
    decimals: 18,
    logo: ethereumIcon,
    name: "Ether",
    symbol: "ETH"
  }
};

@subscribe("tokens")
class Init extends Component {
  constructor(props) {
    super(props);

    chainName$({ withoutLoading: true }).subscribe(chainName => {
      console.log("observable chainname", chainName);
      props.setChainName(chainName);
      props.fetchTokensFromLS();
    });
  }

  render() {
    return this.props.children;
  }
}

class WrappedWithProvider extends Component {
  tokensStore = null;

  // @todo won't update if props.accountAddress changes
  constructor(props) {
    super(props);
    const { accountAddress } = props;

    // Cannot put it in the object or else it's considered an action and must
    // return the new state
    const getLsKey = () =>
      // We have one key per chain per account, in this format:
      // __paritylight::tokens::0x123::kovan
      `${LS_KEY}::${this.tokensStore.accountAddress}::${
        this.tokensStore.chainName
      }`;

    this.tokensStore = {
      accountAddress: accountAddress, // invariable
      chainName: null,
      tokensObject: {},
      setChainName: chainName => ({ chainName }),
      fetchTokensFromLS: () => state => {
        debug(
          `Fetching tokens for account ${state.accountAddress} and chain ${
            state.chainName
          }`
        );
        const lsKey = getLsKey();
        const tokensFromLS = store.get(lsKey);

        if (tokensFromLS) {
          debug(`Got tokens from localStorage`, tokensFromLS);
          return { tokensObject: tokensFromLS };
        } else {
          debug(`No tokens in localStorage; setting default.`);
          // If there's nothing in the localStorage, we add by default only
          // Ethereum. We consider Ethereum as a token, with address 'ETH'
          store.set(lsKey, DEFAULT_TOKENS);
          return { tokensObject: DEFAULT_TOKENS };
        }
      },
      addToken: (address, token) => state => {
        const newTokens = { ...state.tokens, [address]: token };
        store.set(getLsKey(), newTokens);
        return { tokensObject: newTokens };
      },
      removeToken: address => state => {
        const newTokens = state.tokens.filter(
          tokenAddress => tokenAddress !== address
        );
        store.set(getLsKey(), newTokens);
        return { tokensObject: newTokens };
      }
    };
  }

  render() {
    const { accountAddress, Component, ...propsRest } = this.props;

    return (
      <Provider id="tokens" {...this.tokensStore}>
        <Init>
          <Component {...propsRest} />
        </Init>
      </Provider>
    );
  }
}

export const provideTokens = Component =>
  withProps({ Component })(WrappedWithProvider);

const mapContextToProps = context => ({
  tokens: context.tokensObject,
  tokensArray: Object.values(context.tokensObject),
  tokensArrayWithoutEth: Object.values(context.tokensObject).filter(
    ({ address }) => address !== "ETH" // Ethereum is the only token without address, has 'ETH' instead
  )
});

export const consumeTokens = subscribe("tokens", mapContextToProps);
