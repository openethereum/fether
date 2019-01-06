// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { FetherWindowInstance } from "./types";

import parityElectron, {
  getParityPath,
  fetchParity,
  isParityRunning,
  runParity
} from "@parity/electron";
import electron from "electron";
import getRemainingArgs from "commander-remaining-args";
import path from "path";
import url from "url";

import { parity } from "../../../package.json";
import { productName } from "../../../electron-builder.json";
import handleError from "../utils/handleError";
import staticPath from "../utils/staticPath";
import Pino from "../utils/pino";
import addMenu from "../menu";
import cli from "../cli";
import messages from "../messages";

const { BrowserWindow, ipcMain, session } = electron;
const pino = Pino();

let hasCalledInitFetherWindow = false;

class FetherWindow implements FetherWindowInstance {
  private fetherWindow;

  create(): void {
    if (hasCalledInitFetherWindow) {
      throw new Error("Unable to initialise Fether window more than once");
    }

    pino.info(`Starting ${productName}...`);
    this.fetherWindow = new BrowserWindow({
      height: 640,
      resizable: false,
      width: 360
    });

    // Set options for @parity/electron
    parityElectron({
      logger: namespace => log => Pino({ name: namespace }).info(log)
    });

    // Look if Parity is installed
    getParityPath()
      .catch(() =>
        // Install parity if not present
        fetchParity(this.fetherWindow, {
          onProgress: progress =>
            // Notify the renderers on download progress
            this.fetherWindow.webContents.send(
              "parity-download-progress",
              progress
            ),
          parityChannel: parity.channel
        })
      )
      .then(async () => {
        // Run parity when installed

        // Don't run parity if the user ran fether with --no-run-parity
        if (!cli.runParity) {
          return;
        }

        if (
          await isParityRunning({
            wsInterface: cli.wsInterface,
            wsPort: cli.wsPort
          })
        ) {
          return;
        }

        return runParity({
          flags: [
            ...getRemainingArgs(cli),
            "--light",
            "--chain",
            cli.chain,
            "--ws-interface",
            cli.wsInterface,
            "--ws-port",
            cli.wsPort
          ],
          onParityError: err =>
            handleError(err, "An error occured with Parity.")
        });
      })
      .then(() => {
        // Notify the renderers
        this.fetherWindow.webContents.send("parity-running", true);
        global.isParityRunning = true; // Send this variable to renderes via IPC
      })
      .catch(handleError);

    // Globals for fether-react parityStore
    global.wsInterface = cli.wsInterface;
    global.wsPort = cli.wsPort;

    // Opens file:///path/to/build/index.html in prod mode, or whatever is
    // passed to ELECTRON_START_URL
    this.fetherWindow.loadURL(
      process.env.ELECTRON_START_URL ||
        url.format({
          pathname: path.join(staticPath, "build", "index.html"),
          protocol: "file:",
          slashes: true
        })
    );

    // Listen to messages from renderer process
    ipcMain.on("asynchronous-message", (...args) =>
      messages(this.fetherWindow, ...args)
    );

    // Add application menu
    addMenu(this.fetherWindow);

    // WS calls have Origin `file://` by default, which is not trusted.
    // We override Origin header on all WS connections with an authorized one.
    session.defaultSession.webRequest.onBeforeSendHeaders(
      {
        urls: ["ws://*/*", "wss://*/*"]
      },
      (details, callback) => {
        if (!this.fetherWindow) {
          // There might be a split second where the user closes the app, so
          // this.fetherWindow is null, but there is still a network request done.
          return;
        }
        details.requestHeaders.Origin = `parity://${
          this.fetherWindow.id
        }.ui.parity`;
        callback({ requestHeaders: details.requestHeaders }); // eslint-disable-line
      }
    );

    // Open external links in browser
    this.fetherWindow.webContents.on("new-window", function(event, url) {
      event.preventDefault();
      electron.shell.openExternal(url);
    });

    this.fetherWindow.on("closed", () => {
      this.fetherWindow = null;
    });
  }
}

export default FetherWindow;
