// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { chainName$, withoutLoading } from '@parity/light.js';
import debounce from 'lodash/debounce';
import { Header } from 'fether-ui';
import light from '@parity/light.js-react';
import { Link } from 'react-router-dom';

import i18n, { packageNS } from '../i18n';
import RequireHealthOverlay from '../RequireHealthOverlay';
import Health from '../Health';
import NewTokenItem from './NewTokenItem';
import withTokens from '../utils/withTokens';

@withTokens
@light({
  chainName: () => chainName$().pipe(withoutLoading())
})
class Whitelist extends Component {
  state = {
    db: null,
    dbMap: null,
    matches: [],
    search: ''
  };

  calculateMatches = debounce(() => {
    const { db, search } = this.state;

    if (search.length <= 1) {
      this.setState({ matches: [] });
      return;
    }

    const matches = db
      ? db.filter(
        ({ name, symbol }) =>
          name.toLowerCase().includes(search.toLowerCase()) ||
            symbol.toLowerCase().includes(search.toLowerCase())
      )
      : [];
    this.setState({ matches });
  }, 500);

  componentDidMount () {
    if (this.props.chainName) {
      this.fetchTokensDb();
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.chainName && !prevProps.chainName) {
      this.fetchTokensDb();
    }
  }

  fetchTokensDb = async () => {
    if (this.state.db) {
      // Don't fetch again if it's already fetched
      return;
    }

    // We only fetch this huge json if the user visits this NewToken page. We
    // try to avoid it as much as possible. All other tokens info (used in the
    // homepage) are stored in localStorage.
    let db;
    try {
      db = (await import(`../assets/tokens/${this.props.chainName}.json`))
        .default;
    } catch (e) {
      this.setState({ db: [], dbMap: {} });
      return;
    }

    // We create a address=>token mapping here
    const dbMap = {};
    db.forEach(token => (dbMap[token.address] = token));

    // Commit this into the state
    this.setState({ db, dbMap });
  };

  handleSearch = ({ target: { value } }) => {
    this.setState({ search: value });
    this.calculateMatches();
  };

  handleClear = () => {
    this.setState({ search: '' });
    this.calculateMatches();
  };

  render () {
    const { history } = this.props;
    const { matches, search } = this.state;

    const displayedTokens = search ? matches : this.props.tokensArrayWithoutEth;

    return (
      <React.Fragment>
        <Header
          left={
            <Link to='/tokens' className='icon -back' onClick={history.goBack}>
              {i18n.t(`${packageNS}:navigation.close`)}
            </Link>
          }
          title={<h1>{i18n.t(`${packageNS}:search_tokens.title`)}</h1>}
        />
        <RequireHealthOverlay require='sync'>
          <div className='window_content'>
            <div className='box -scroller'>
              <div className='box -padded'>
                <div className='search-form'>
                  <input
                    onChange={this.handleSearch}
                    placeholder={i18n.t(
                      `${packageNS}:search_tokens.placeholder`
                    )}
                    value={search}
                    type='text'
                  />
                  <button
                    onClick={this.handleClear}
                    className='button -icon -clear'
                    disabled={!search.length}
                  >
                    {i18n.t(`${packageNS}:search_tokens.clear`)}
                  </button>
                </div>
              </div>
              <ul className='list -tokens'>
                {displayedTokens.map(token => (
                  <NewTokenItem key={token.address} token={token} />
                ))}
              </ul>
            </div>
          </div>
        </RequireHealthOverlay>
        <nav className='footer-nav'>
          <div className='footer-nav_status'>
            <Health />
          </div>
        </nav>
      </React.Fragment>
    );
  }
}

export default Whitelist;
