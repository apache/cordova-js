<!--
#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
#  KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#
-->

# cordova-js

[![NPM](https://nodei.co/npm/cordova-js.png)](https://nodei.co/npm/cordova-js/)

[![Node CI](https://github.com/apache/cordova-js/workflows/Node%20CI/badge.svg?branch=master)](https://github.com/apache/cordova-js/actions?query=branch%3Amaster)

A unified JavaScript layer for [Apache Cordova](http://cordova.apache.org/) projects.

## Project Structure

  ```text
  ./
    |-build-tools/ ......... custom bundler for our CommonJS-like modules
    |-pkg/ ................. generated platform cordova.js files
    |
    |-src/ ................. the code that makes up Cordova's JavaScript runtime
    |  |-cordova.js ........ common Cordova stuff
    |  |
    |  |-common/ ........... base modules shared across platfoms
    |  |  |-argscheck.js ... utility for type-checking arguments during runtime
    |  |  |-base64.js ...... base64 utilites (toArrayBuffer & fromArrayBuffer)
    |  |  |-builder.js ..... utilities to install a set of properties onto an object
    |  |  |-channel.js ..... pub/sub implementation for custom framework events
    |  |  |-init.js ........ bootstraps the Cordova platform, inject APIs and fire events
    |  |  |-utils.js ....... closures, uuids, object, cloning, extending prototypes
    |  |  |
    |  |  '-exec/ .......... exec methods
    |  |     '-proxy.js .... utility for adding and removing exec proxy methods
    |  |
    |  '-scripts/ .......... non-module JS that gets concatenated to cordova.<platform>.js
    |     |-bootstrap.js ... bootstrap the Cordova platform, inject APIs and fire events
    |     '-require.js ..... module definition and require() implementation
    |
    '-tests/ ............... unit tests
  ```

## Setup for Building

* Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

  `npm` should come pre-installed with `Node.js`. If `Node.js` installed but can not run `npm`, please follow the npm doc: [Downloading and installing Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

* Install all the node dependencies by running the following command from the repository root:

  ```bash
  npm install
  ```

## Building

The build script assumes that users have the cordova-platforms checked out as siblings to this `cordova-js` directory. When generating `cordova.js`, `npm run build` will grab platform specific files from these directories if they exist.

Then from the repository root run:

  ```bash
  npm run build
  ```

To compile the js for just one platform, run:

  ```bash
  npx grunt compile:android --platformVersion=4.0.0
  ```

To compile the js for all platforms but pass in a custom path for your cordova-android and cordova-ios platforms, run:

  ```bash
  npm run build -- --android='../custompath/cordova-android' --ios='../custompath/cordova-ios'
  ```

For integration, see the 'Integration' section below.

## How It Works

The `build-tools/build.js` process is a Node.js script that concatenates all of the core Cordova plugins in this repository into a `cordova.<platform>.js` file under the `pkg/` folder. It also wraps the plugins with a RequireJS-compatible module syntax that works in both browser and node environments. We end up with a `cordova.js` file that wraps each **Cordova** *plugin* into its own module.

**Cordova** defines a `channel` module under `src/common/channel.js`, which is a *publish/subscribe* implementation that the project uses for event management.

The **Cordova** *native-to-webview* bridge is initialized in `src/scripts/bootstrap.js`. This file attaches the `boot` function to the `channel.onNativeReady` event - fired by native with a call to:

  ```js
  cordova.require('cordova/channel').onNativeReady.fire()
  ```

The `boot` method does all the work.  First, it grabs the common platform definition (under `src/common/common.js`) and injects all of the objects defined there onto `window` and other global namespaces. Next, it grabs all of the platform-specific object definitions (as defined under `src/<platform>/platform.js`) and overrides those onto `window`. Finally, it calls the platform-specific `initialize` function (located in the platform definition). At this point, Cordova is fully initialized and ready to roll. Last thing we do is wait for the `DOMContentLoaded` event to fire to make sure the page has loaded properly. Once that is done, Cordova fires the `deviceready` event where you can safely attach functions that consume the Cordova APIs.

## Testing

Tests run in a bundled headless Chromium instance. They can be run with:

  ```bash
  npm test
  ```

Final testing should always be done with the [Mobile Spec test application](https://github.com/apache/cordova-mobile-spec).

## Integration

### Cordova

Build the js files by running **grunt** as described above. Update each platform independently. For a given platform:

Replace the `cordova.js` file in the cordova <platform>platform_www/cordova.js directory with the newly generated `cordova.js` file. If necessary, change the name of the new file to match that of the overwritten one.

Once the new js file has been added, any new projects created will use the updated js. To update an already existing project, directly replace the cordova.js file within the project's `www/` folder with the generated `cordova.PLATFORM.js`. Make sure to change the file name to match the original.

## Adding a New Platform

### In Your Platform Repository

1. Create the `cordova-js-src` directory.

2. Write a module that encapsulates your platform's `exec` method and call it `exec.js`. This file should be added into the `<platform-repo>/cordova-js-src` directory which was created from step 1.

    The `exec` method is a JavaScript function that enables communication from the platform's JavaScript environment into the platform's native environment. Each platform uses a different mechanism to enable this bridge. We recommend you check out the other platform `exec` definitions for inspiration.

    The `exec` method has the following method signature: `function(success, fail, service, action, args)`

    **Methods Arguments:**

    * `success`: a success function callback
    * `fail`: a failure function callback
    * `service`: a string identifier that the platform can resolve to a native class
    * `action`: a string identifier that the platform can resolve to a specific method inside the class pointed to by `service`
    * `args`: an array of parameters to pass to the native method invoked by the `exec` call

    It is required that new platform additions be as consistent as possible with the existing `service` and `action` labels.

3. Define your platform definition object and name it `platform.js`. This file should be added into the `<platform-repo>/cordova-js-src` directory which was created from step 1.

    This file should export an object with the following properties:

     * `id`: a string representing the platform. This should match the name of the `.js` file.
     * `bootstrap`: A function that sets up the platform. Must fire the `onNativeReady` channel when done.
     * `initialize`: an optional function that is called after the global scope setup is done (i.e. Cordova and all plugins are ready)

    The following is a simple example of a platform definition:

    ```js
    module.exports = {
        id: 'atari',
        bootstrap: function() {
            require('cordova/channel').onNativeReady.fire();
        }
    };
    ```

### In `cordova-js` Repository

1. Add a `<platform>: {}` entry to the `Gruntfile.js` `compile` arrays.
