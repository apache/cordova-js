# acorn-node change log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

## 1.5.2

 * Upgrade acorn to support optional catch binding in the AST walker.

## 1.5.1

 * Fix tests on Node <= 0.12.

## 1.5.0

 * Add tests for async iteration, optional catch binding, import.meta,
   dynamic import, bigint (currently unsupported).
 * Add import.meta support. (`sourceType: 'module'` only)
 * Add dynamic import support. (`sourceType: 'module'` only)
 * Fix optional catch binding support in the walker.

## 1.4.0

 * Upgrade acorn to 5.6, which supports optional catch bindings and other
   new syntax features.
 * Set ecmaVersion to 2019 to opt in to optional catch bindings etc.

## 1.3.0

 * Upgrade acorn to 5.4, which supports object spread and async iteration.
 * Remove acorn5-object-spread plugin.

## 1.2.0

 * Expose `acorn/dist/walk` as `acorn-node/walk`.

## 1.1.0

 * Enable `allowHashBang` and `allowReturnOutsideFunction` by default.

## 1.0.0

 * Initial release.
