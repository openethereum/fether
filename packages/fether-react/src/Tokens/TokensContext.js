// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from "react";
import { chainName$ } from "@parity/light.js";
import store from "store";
import { Provider, subscribe } from "react-contextual";

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

export const provideTokens = Comp => props => {
  console.log("RENDERING PROVIDER; props", JSON.stringify(props));

  const { accountAddress, ...propsRest } = props;

  const tokensStore = {
    accountAddress: accountAddress, // invariable
    chainName: null,
    tokensObject: {},
    getLsKey: () => state =>
      // We have one key per chain per account, in this format:
      // __paritylight::tokens::0x123::kovan
      `${LS_KEY}::${state.accountAddress}::${state.chainName}`,
    fetchTokensFromLS: chainName => state => {
      debug(
        `Fetching tokens for account ${
          state.accountAddress
        } and chain ${chainName}`
      );
      const lsKey = state.getLsKey();
      const tokensFromLS = store.get(lsKey);

      if (tokensFromLS) {
        debug(`Got tokens from localStorage`, tokensFromLS);
        return tokensFromLS;
      } else {
        debug(`No tokens in localStorage; setting default.`);
        // If there's nothing in the localStorage, we add by default only
        // Ethereum. We consider Ethereum as a token, with address 'ETH'
        store.set(lsKey, DEFAULT_TOKENS);
        return DEFAULT_TOKENS;
      }
    },
    addToken: (address, token) => state => {
      const newTokens = { ...state.tokens, [address]: token };
      store.set(state.getLsKey(), newTokens);
      return newTokens;
    },
    removeToken: address => state => {
      const newTokens = state.tokens.filter(
        tokenAddress => tokenAddress !== address
      );
      store.set(state.getLsKey(), newTokens);
      return newTokens;
    }
  };

  chainName$({ withoutLoading: true }).subscribe(chainName => {
    console.log("observable chainname", chainName);
    tokensStore.fetchTokensFromLS(chainName)(tokensStore);
  });
  // should only be called on component mount

  debug("testing debug, dont mind me");

  return (
    <Provider id="tokens" {...tokensStore}>
      <Comp {...propsRest} />
    </Provider>
  );
};

const mapContextToProps = context => ({
  tokens: context.tokensObject,
  tokensArray: Object.values(context.tokensObject),
  tokensArrayWithoutEth: Object.values(context.tokensObject).filter(
    ({ address }) => address !== "ETH" // Ethereum is the only token without address, has 'ETH' instead
  )
});

export const consumeTokens = subscribe("tokens", mapContextToProps);
