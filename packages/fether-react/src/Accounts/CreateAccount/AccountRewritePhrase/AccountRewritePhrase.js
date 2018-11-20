// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from "react";
import { AccountCard, Card, Form as FetherForm } from "fether-ui";

import { inject, observer } from "mobx-react";

@inject("createAccountStore")
@observer
class AccountRewritePhrase extends Component {
  state = {
    isLoading: false,
    isFileValid: false,
    json: null,
    value: ""
  };

  handleChange = ({ target: { value } }) => {
    this.setState({ value });
  };

  handleChangeFile = ({ target: { result } }) => {
    try {
      const json = JSON.parse(result);

      const isFileValid =
        json.address.length === 32 &&
        typeof json.meta === "object" &&
        json.encoding.content === "pkcs8";

      this.setState({
        isFileValid,
        json
      });
    } catch (error) {
      this.setState({
        isFileValid: false,
        json: null
      });
      console.error(error);
    }
  };

  handleNextStep = async () => {
    const {
      history,
      location: { pathname },
      createAccountStore: { isImport, isJSON, setJSON, setPhrase }
    } = this.props;
    const currentStep = pathname.slice(-1);
    const { json, value } = this.state;

    if (isJSON) {
      this.setState({ isLoading: true });
      console.log("setting address ", json.address);
      await setJSON(json);
      // await setAddress(json.address);
    }

    // If we're importing, derive address from recovery phrase when we submit
    else if (isImport) {
      this.setState({ isLoading: true });
      await setPhrase(value);
    }

    history.push(`/accounts/new/${+currentStep + 1}`);
  };

  toggleImportMethod = () => {
    const { createAccountStore } = this.props;
    createAccountStore.setIsJSON(!createAccountStore.isJSON);
  };

  render() {
    const {
      createAccountStore: { address, isImport, isJSON, name },
      history,
      location: { pathname }
    } = this.props;
    const { value } = this.state;
    const currentStep = pathname.slice(-1);
    const body = [
      <div key="createAccount">
        <div className="text">
          {isImport ? (
            isJSON ? (
              <div>
                <p> Drop your JSON keyfile below </p>
                <button onClick={this.toggleImportMethod} className="button">
                  Use Seed Phrase
                </button>
              </div>
            ) : (
              <div>
                <p> Type your Recovery phrase </p>
                <button onClick={this.toggleImportMethod} className="button">
                  Use JSON Keyfile
                </button>
              </div>
            )
          ) : (
            <p>
              Type your secret phrase to confirm that you wrote it down
              correctly:
            </p>
          )}
        </div>

        {isJSON ? (
          <FetherForm.InputFile
            label="JSON Backup Keyfile"
            onChangeFile={this.handleChangeFile}
            required
            value={value}
          />
        ) : (
          <FetherForm.Field
            as="textarea"
            label="Recovery phrase"
            onChange={this.handleChange}
            required
            value={value}
          />
        )}

        <nav className="form-nav -space-around">
          {currentStep > 1 && (
            <button className="button -cancel" onClick={history.goBack}>
              Back
            </button>
          )}
          {this.renderButton()}
        </nav>
      </div>
    ];

    return isImport ? (
      <Card>{body}</Card>
    ) : (
      <AccountCard
        address={address}
        name={address && !name ? "(no name)" : name}
        drawers={[body]}
      />
    );
  }

  renderButton = () => {
    const {
      createAccountStore: { isImport, phrase }
    } = this.props;
    const { isLoading, json, value } = this.state;

    // If we are creating a new account, the button just checks the phrase has
    // been correctly written by the user.
    if (!isImport) {
      return (
        <button
          className="button"
          disabled={value !== phrase}
          onClick={this.handleNextStep}
        >
          Next
        </button>
      );
    }

    // If we are importing an existing account, the button goes to the next step
    return (
      <button
        className="button"
        disabled={(!value.length && !json) || isLoading}
        onClick={this.handleNextStep}
      >
        Next
      </button>
    );
  };
}

export default AccountRewritePhrase;
