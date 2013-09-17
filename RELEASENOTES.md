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
## Release Notes for Cordova (JS) ##

### 3.1.0 (Sept 2013) ###

42 commits from 8 authors. Highlights include:

New Features:
* [CB-4761] Add cordova.platformId property
* [CB-4725] Export cordova version as "cordova.version"
* [CB-4420] Add a helper function for resolving relative URLs (cordova/urlutil)
* Initial FirefoxOS support

Other Changes:
* [CB-4149] Read version from VERSION when there is no .git/
* [android] Move non-plugin files out of plugins/ subdirectory.
* [android] Tweak the online bridge to tell native when an event has happened.
* Move bootstrap.js logic into a proper module "init.js"
* [all] Move some start-up logic from cordova.js -> bootstrap.js
* [CB-4418] Delete loadMatchingModules() and move modulemapping call into bootstrap.js (from platform.js)
* [all] Make pluginloader call a callback instead of firing a channel.
* [win8] Move commandProxy.js into windows8/
* [CB-4428] Delete Android storage plugin from cordova-js (moved into cordova-android repo as a plugin)
* [CB-4419] Remove non-CLI platforms from cordova-js.
* Make base64 tests work in browser as well as Node
* Change Gruntfile to auto-build before running tests
* [Windows8] remove all plugins
* [CB-4281] Moving echo to a plugin in mobilespec
* Fix grunt tests by deleting plugin-related and legacy BB tests
