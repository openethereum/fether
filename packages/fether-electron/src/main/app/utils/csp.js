// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

// References: https://github.com/parity-js/shell
const CSP_CONFIG = {
  dev: [
    // Disallow mixed content
    'block-all-mixed-content;',
    // Disallow framing and web workers.
    "child-src 'none';",
    // Only allow connecting to WSS and HTTPS servers.
    'connect-src https: wss:;',
    // Fallback for missing directives.
    // Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/default-src
    //
    // Disallow everything as fallback by default for all CSP fetch directives.
    "default-src 'none';",
    // Disallow fonts.
    "font-src 'none';", // Additionally used in Parity-JS Shell `'self' data: https:`
    // Disallow submitting any forms
    "form-action 'none';",
    // Disallow framing.
    "frame-src 'none';",
    // Only allow HTTPS for images. Token provider logos must be https://
    // Allow `data:` `blob:`.
    "img-src 'self' 'unsafe-inline' file: data: blob: https:;",
    // Disallow manifests.
    "manifest-src 'none';",
    // Disallow media.
    "media-src 'none';",
    // Disallow fonts and `<webview>` objects
    "object-src 'none';",
    // Disallow prefetching.
    "prefetch-src 'none';",
    // Only allow `http:` and `unsafe-eval` in dev mode (required by create-react-app)
    "script-src 'self' file: http: blob: 'unsafe-inline' 'unsafe-eval';",
    // Disallow script elements.
    "script-src-elem 'none';",
    // Disallow script attributes.
    "script-src-attributes 'none';",
    "style-src 'self' 'unsafe-inline' file: blob:;", // Additionally used in Parity-JS Shell `data: https:`
    // Disallow style elements.
    "style-src-elem 'none';",
    // Disallow style attributes.
    "style-src-attributes 'none';",
    // Allow `blob:` for camera access (worker)
    'worker-src blob:;' // Additionally used in Parity-JS Shell `'self' https:`
  ],
  prod: [
    // Disallow mixed content
    'block-all-mixed-content;',
    // Disallow framing and web workers.
    "child-src 'none';",
    // Only allow connecting to WSS and HTTPS servers.
    'connect-src https: wss:;',
    // Fallback for missing directives.
    // Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/default-src
    //
    // Disallow everything as fallback by default for all CSP fetch directives.
    "default-src 'none';",
    // Disallow fonts.
    "font-src 'none';", // Additionally used in Parity-JS Shell `'self' data: https:`
    // Disallow submitting any forms
    "form-action 'none';",
    // Disallow framing.
    "frame-src 'none';",
    // Only allow HTTPS for images. Token provider logos must be https://
    // Allow `data:` `blob:`.
    "img-src 'unsafe-inline' file: data: blob: https:;", // Additionally used in Parity-JS Shell `'self'`
    // Disallow manifests.
    "manifest-src 'none';",
    // Disallow media.
    "media-src 'none';",
    // Disallow fonts and `<webview>` objects
    "object-src 'none';",
    // Disallow prefetching.
    "prefetch-src 'none';",
    "script-src file: 'unsafe-inline';",
    // Disallow script elements.
    "script-src-elem 'none';",
    // Disallow script attributes.
    "script-src-attributes 'none';",
    "style-src unsafe-inline' file: blob:;", // Additionally used in Parity-JS Shell `data: https:`
    // Disallow style elements.
    "style-src-elem 'none';",
    // Disallow style attributes.
    "style-src-attributes 'none';",
    // Allow `blob:` for camera access (worker)
    'worker-src blob:;' // Additionally used in Parity-JS Shell `'self' https:`
  ]
};

const CSP =
  process.env.NODE_ENV === 'development'
    ? CSP_CONFIG.dev.join(' ')
    : CSP_CONFIG.prod.join(' ');

export { CSP };
