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

### 3.7.3 (Jan 06, 2015)
* CB-8210 Use the correct plugin for App/CoreAndroid plugin based on platformVersion
* CB-8210 android: Fire events from native via message channel (close #97)
* CB-8158 updated browserify dependency
* CB-8210 android: Add message channel for events (closes #96)
* CB-8129 Adds 'cover' grunt task to generate tests coverage report (close #95)
* BlackBerry: revert 4176a7d48b5d236613062fe2c8ba8655fd7b7c12
* BlackBerry: update grunt config to match coho platform name
* [Amazon related change] base64.toArrayBuffer to convert base64 strings according to https://git-wip-us.apache.org/repos/asf?p=cordova-js.git;a=commit;h=6fde14b81988b1eb118c42f47cbdfbb08d756256
* CB-8158 removed extra symbolList declartion
* reverting license header
* CB-8158 populating symbolList

### 3.7.2 (Nov 7, 2014)
* CB-7868 Make <clobbers> on navigator not break on some versions of Android
* CB-7868 Use utils.defineGetterSetter instead of Object.defineProperty
* Upleveled amazon-fireos bridge.
* CB-7735 Fix iOS bridge race condition when using innerHTML on <body>
* CB-2520 - User agent-related changes for custom user agents in iOS

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
* CB-7349 Tell users to run npm install
* Upleveled amazon-fireos changes.
* CB-870 android: Add volume button event support
* [fxos] Remove hardcoded cordova version
* CB-6764 Fix findCordovaPath() detecting "notcordova.js" as cordova.js
* CB-6976 Add support for Windows Universal apps (Windows 8.1 and WP 8.1)
* CB-6714 Base webOS 3.x Cordova implementation
* Fixed jshint whitespace issues
* android: Delete Location-change JS->Native bridge mode
* CB-5988 android: Allow exec() only from file: or start-up URL's domain
* CB-7034 [BlackBerry10] Add error handling to exec makeSyncCall
* CB-6983 misleading debug statement
* CB-6884 - Fixed js callbacks not firing using WKWebView Cordova bridge
* CB-6884 - Added WKWebView Cordova bridge
* updating version
* maximzing jshint satisfaction
* CB-6863 - Default Cordova bridge broken due to replacing window.navigator (iOS 8)
* CB-6867 [wp8, windows8] allow empty args
* adding cordova.require
* adding transform for File plugin
* CB-6792 Add license to CONTRIBUTING.md
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


