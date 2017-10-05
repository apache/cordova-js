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
## Release Notes for Cordova JS ##

### 4.2.2 (Oct 04, 2017)
* [CB-12017](https://issues.apache.org/jira/browse/CB-12017) updated dependencies for `Browserify`
* [CB-12762](https://issues.apache.org/jira/browse/CB-12762) point `package.json` repo items to github mirrors instead of apache repos
* [CB-12895](https://issues.apache.org/jira/browse/CB-12895) added `eslint` to repo
* [CB-13232](https://issues.apache.org/jira/browse/CB-13232) added test for cordova's unique local style require
* [CB-8990](https://issues.apache.org/jira/browse/CB-8990) bump nodejs requirement to 4.0.0+
* [CB-12847](https://issues.apache.org/jira/browse/CB-12847) added `bugs` entry to `package.json`.
* [CB-12748](https://issues.apache.org/jira/browse/CB-12748) Update CI to test node 4 and 6

### 4.2.1 (Jan 17, 2017)
* [CB-12358](https://issues.apache.org/jira/browse/CB-12358) updated deps for release

### 4.2.0 (Oct 21, 2016)
* [CB-12017](https://issues.apache.org/jira/browse/CB-12017) updated dependencies in `package.json`
* [CB-3785](https://issues.apache.org/jira/browse/CB-3785) add support for `EventListener interface` to `Channel.prototype.subscribe` 
* Add github pull request template
* [CB-11928](https://issues.apache.org/jira/browse/CB-11928) removed jshint from `grunt.registerTask` because it doesn't work with node6
* [CB-9967](https://issues.apache.org/jira/browse/CB-9967) deleted legacy platform specific files
* [CB-11522](https://issues.apache.org/jira/browse/CB-11522) [**windows**] Make cordova-js handle `unknown` type
* SECURITY ISSUE: Resolve minimatch DDOS issue.
* [CB-11522](https://issues.apache.org/jira/browse/CB-11522) Make `utils.clone` handle properties gracefully

### 4.1.4 (Mar 17, 2016)
* [CB-10650](https://issues.apache.org/jira/browse/CB-10650) Non-index `content.src` causes Splashscreen to be not displayed on browser
* [CB-10558](https://issues.apache.org/jira/browse/CB-10558) Update `cordova-js` according to **windows8** deprecation

### 4.1.3 (Jan 25, 2016)
* [CB-9883](https://issues.apache.org/jira/browse/CB-9883) - remove unused bridge tests
* add **JIRA** issue tracker link

### 4.1.2 (Oct 30, 2015)
* [CB-9800](https://issues.apache.org/jira/browse/CB-9800) Fixing contribute link.
* [CB-9370](https://issues.apache.org/jira/browse/CB-9370) Changes jsdom dependency to avoid package installation issues

### 4.1.1 (Aug 28, 2015)
* [CB-9505](https://issues.apache.org/jira/browse/CB-9505) Correct plugin modules loading within browserify flow. This closes #126
* [CB-9342](https://issues.apache.org/jira/browse/CB-9342) Fix deviceReady event not fired on Windows 10 in hosted environment

### 4.1.0 (Aug 06, 2015)
* [CB-9429](https://issues.apache.org/jira/browse/CB-9429) Removes tests from resultant bundle
* [CB-9436](https://issues.apache.org/jira/browse/CB-9436) Removes `require-tr` bundle transformation
* [CB-9429](https://issues.apache.org/jira/browse/CB-9429) Enables jsdom/browser tests for browserify.
* add comment about where/when this file is used
* alt versions of isArray if available, isDate uses instanceof, clean up extend and close
* added tests for isArray and isDate
* argscheck does not use exec
* Fix webOS SmartTV/wearable detection
* Add webOS as a platform to build from/for.
* Fixed issues with data transforms when using browserify
* [CB-9370](https://issues.apache.org/jira/browse/CB-9370) Fixes failing tests on Node 0.12 due to stale dependency
* [CB-9291](https://issues.apache.org/jira/browse/CB-9291) Removes the requirement for specific NodeJS version
* remove firefox, failing on windows
* Added common 'activated' channel
* [CB-9156](https://issues.apache.org/jira/browse/CB-9156) added support for absolute platform paths
* [CB-9156](https://issues.apache.org/jira/browse/CB-9156) platform version grabbing supports custom paths
* [CB-9156](https://issues.apache.org/jira/browse/CB-9156) added ability to pass in custom path via command line for platforms
* Adding .ratignore file.
* [CB-9137](https://issues.apache.org/jira/browse/CB-9137) Fixes cordova-lib tests failures
* [CB-8468](https://issues.apache.org/jira/browse/CB-8468) - Application freezes if breakpoint hits JavaScript callback invoked from native

### 4.0.0 (May 27, 2015)
* [CB-9057](https://issues.apache.org/jira/browse/CB-9057) Updated cordova.js for Windows to refer to base.js instead of the full-blown WinJS.js.
* [CB-6865](https://issues.apache.org/jira/browse/CB-6865) added browserify support for plugins with any id
* [CB-8441](https://issues.apache.org/jira/browse/CB-8441) added missing requires and updated npm run scripts
* [CB-8441](https://issues.apache.org/jira/browse/CB-8441) platformVersion flag not required anymore. Grab version from dependecy platform versions
* [CB-8441](https://issues.apache.org/jira/browse/CB-8441) updated workflow to use cordova-js-src when available
* [CB-8441](https://issues.apache.org/jira/browse/CB-8441) grunt compile now uses platform dependencies cordova-js-src for platform specific exec files
* [CB-8441](https://issues.apache.org/jira/browse/CB-8441) added platforms as dev dependencies
* Added template-packaged WinJS reference for Windows 10 support. This closes #111
* [CB-8996](https://issues.apache.org/jira/browse/CB-8996) (Windows) Fixed invalid null comparison. This closes #110.
* updated browserify dependency to 10.1.3
* Revert "CB-8674: Creates a 'cordova.env' object, and then on Windows hangs the"
* Revert "reverted global change to cordova object, added temp? 'activate' event to windows platform"
* reverted global change to cordova object, added temp? 'activate' event to windows platform
* [CB-8674](https://issues.apache.org/jira/browse/CB-8674) Creates a 'cordova.env' object, and then on Windows hangs the activation arguments off of cordova.env.args.
* android: Delete PRIVATE_API bridge mode enum, since it was removed in 4.0.0
* [CB-8838](https://issues.apache.org/jira/browse/CB-8838) - Disabled commandQueue for WK_WEBVIEW_BINDING. (closes #107)

### 3.9.0 (Apr 16, 2015)
* Verify that window.cordova does not already exist and throw error if it does
* Added appveyor badge
* [CB-8711](https://issues.apache.org/jira/browse/CB-8711) wait for all callbacks before evaluating expectations
* [CB-8223](https://issues.apache.org/jira/browse/CB-8223) Adds configparser module for exposing config.xml in the Browser platform
* [CB-8667][Windows]Handle case where checking for NORESULT returns falsy because NORESUL
* add TravisCI link and banner

### 3.8.0 (February 27, 2015)
* [CB-8378](https://issues.apache.org/jira/browse/CB-8378) android: Deleted hidekeyboard & showkeyboard events
* android: Use correct plugin name for navigator.app exec() calls
* [CB-8314](https://issues.apache.org/jira/browse/CB-8314) Speed up Travis CI (close #102)
* [CB-8302](https://issues.apache.org/jira/browse/CB-8302) Added `npm test` script
* [CB-8158](https://issues.apache.org/jira/browse/CB-8158) fixed symbolList require
* [CB-8300](https://issues.apache.org/jira/browse/CB-8300) Added CI configuration files
* [CB-8298](https://issues.apache.org/jira/browse/CB-8298) android: Execute exec callbacks within their own stack frames
* [CB-8210](https://issues.apache.org/jira/browse/CB-8210) Remove unused onDestroy channel (close #99)
* Fixed callbackFromNative method

### 3.7.3 (Jan 06, 2015)
* [CB-8210](https://issues.apache.org/jira/browse/CB-8210) Use the correct plugin for App/CoreAndroid plugin based on platformVersion
* [CB-8210](https://issues.apache.org/jira/browse/CB-8210) android: Fire events from native via message channel (close #97)
* [CB-8158](https://issues.apache.org/jira/browse/CB-8158) updated browserify dependency
* [CB-8210](https://issues.apache.org/jira/browse/CB-8210) android: Add message channel for events (closes #96)
* [CB-8129](https://issues.apache.org/jira/browse/CB-8129) Adds 'cover' grunt task to generate tests coverage report (close #95)
* BlackBerry: revert 4176a7d48b5d236613062fe2c8ba8655fd7b7c12
* BlackBerry: update grunt config to match coho platform name
* [Amazon related change] base64.toArrayBuffer to convert base64 strings according to https://git-wip-us.apache.org/repos/asf?p=cordova-js.git;a=commit;h=6fde14b81988b1eb118c42f47cbdfbb08d756256
* [CB-8158](https://issues.apache.org/jira/browse/CB-8158) removed extra symbolList declartion
* reverting license header
* [CB-8158](https://issues.apache.org/jira/browse/CB-8158) populating symbolList

### 3.7.2 (Nov 7, 2014)
* [CB-7868](https://issues.apache.org/jira/browse/CB-7868) Make <clobbers> on navigator not break on some versions of Android
* [CB-7868](https://issues.apache.org/jira/browse/CB-7868) Use utils.defineGetterSetter instead of Object.defineProperty
* Upleveled amazon-fireos bridge.
* [CB-7735](https://issues.apache.org/jira/browse/CB-7735) Fix iOS bridge race condition when using innerHTML on <body>
* [CB-2520](https://issues.apache.org/jira/browse/CB-2520) - User agent-related changes for custom user agents in iOS

### 3.7.1 (Oct 10, 2014)
* added missing AL header
* removed console.log

### 3.6.3 ###

* Set Version to 3.6.3 (manually)
* Set VERSION to 3.6.0 (via coho)
* Removed old comment
* Checking for windows style path
* Better handling of all "modulemapper.clobbers" replacements
* Fixed browserify onDeviceReady event not firing on the browser
* Removed check for "c:" and added check for windows platform
* Fixed Windows path issue when trying to set "navigator.app" in cordova.js
* [CB-7349](https://issues.apache.org/jira/browse/CB-7349) Tell users to run npm install
* Upleveled amazon-fireos changes.
* [CB-870](https://issues.apache.org/jira/browse/CB-870) android: Add volume button event support
* [fxos] Remove hardcoded cordova version
* [CB-6764](https://issues.apache.org/jira/browse/CB-6764) Fix findCordovaPath() detecting "notcordova.js" as cordova.js
* [CB-6976](https://issues.apache.org/jira/browse/CB-6976) Add support for Windows Universal apps (Windows 8.1 and WP 8.1)
* [CB-6714](https://issues.apache.org/jira/browse/CB-6714) Base webOS 3.x Cordova implementation
* Fixed jshint whitespace issues
* android: Delete Location-change JS->Native bridge mode
* [CB-5988](https://issues.apache.org/jira/browse/CB-5988) android: Allow exec() only from file: or start-up URL's domain
* [CB-7034](https://issues.apache.org/jira/browse/CB-7034) [BlackBerry10] Add error handling to exec makeSyncCall
* [CB-6983](https://issues.apache.org/jira/browse/CB-6983) misleading debug statement
* [CB-6884](https://issues.apache.org/jira/browse/CB-6884) - Fixed js callbacks not firing using WKWebView Cordova bridge
* [CB-6884](https://issues.apache.org/jira/browse/CB-6884) - Added WKWebView Cordova bridge
* updating version
* maximzing jshint satisfaction
* [CB-6863](https://issues.apache.org/jira/browse/CB-6863) - Default Cordova bridge broken due to replacing window.navigator (iOS 8)
* [CB-6867](https://issues.apache.org/jira/browse/CB-6867) [wp8, windows8] allow empty args
* adding cordova.require
* adding transform for File plugin
* [CB-6792](https://issues.apache.org/jira/browse/CB-6792) Add license to CONTRIBUTING.md
* removed contacts hack, added regex to handle geolocation
* Fix some old references in the README.md (This closes #69)
* updating transform to support bs paths
* updating transform for ios contacts
* updating version
* moving to TreeTransformer and adding a quick substitution for Android navigator.app clobber
* Changed id to amazon-fireos.
* Fix broken unit tests with node v0.11.13+ (hack)
* Disable urlutil tests under jsdom & set jsdom to file: to avoid hitting network
* Upleveled changes from android.
* updating version
* Upleveled changes from android.
* CB-6587:Set Vesion to 3.6.0-dev
