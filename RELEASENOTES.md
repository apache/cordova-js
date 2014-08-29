
### 3.7.0 (Aug 29, 2014)
* Set VERSION to 3.7.0-dev (via coho)
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
* updating version
* fixing jshint ident
* Revert "Revert "Merge branch 'master' into browserify""
* Revert "Merge branch 'browserify'"
* CB-6491 add CONTRIBUTING.md
* Fix tests showing warning about util.print.
* Fix cordova-js grunt failing due to jshint errors from WinJS commit
* CB-6539 Future proof the WinJS include
* updating package.json
* fixing jshint error
* Revert "Merge branch 'master' into browserify"
* CB-5488 ios: Don't attempt iframe bridge until document.body exists
* CB-6419 pause and resume events should be fired without a timeout
* CB-6388: Add base64.toArrayBuffer() method to support binary data from the LOAD_URL bridge
* CB-5606 WP8. ArrayBuffer does not exist in WP7
* Fixed "WARNING: file name src\ubuntu\platform.js is missing the license header" during compile
* adding channel pre deviceready
* adding case for org.apache.cordova.* modules
* adding cordova.require fake wrapper
* exec was set in the wrong file
* removing onPluginsReady and setting platform exec
* updating version
* fixing weird outputstream problem
* moving license writing to other module
* replacing cordova.js and init.js with their browserify-compatible equivalents
* replacing init with init_b
* updating transform/bundler/packager
* replacing platform/exec
* files were not properly generated
* adding debug flag to support sourcemaps
* adding other platforms
* adding android and amazon-fireos
* Adding compile-browserify grunt task
* adding browserify compile task
* adding browserify bundle
* adding browserify packager
* adding browserify require transform
* adding required libraries to browserify
* adding cordova.require fake wrapper
* exec was set in the wrong file
* removing onPluginsReady and setting platform exec
* updating version
* fixing weird outputstream problem
* moving license writing to other module
* replacing cordova.js and init.js with their browserify-compatible equivalents
* replacing init with init_b
* updating transform/bundler/packager
* replacing platform/exec
* files were not properly generated
* adding debug flag to support sourcemaps
* adding other platforms
* adding android and amazon-fireos
* Adding compile-browserify grunt task
* adding browserify compile task
* adding browserify bundle
* adding browserify packager
* adding browserify require transform
* adding required libraries to browserify
* CB-6321 Added cordova integration info to README
* CB-6184 android: Delete incorrect log message about falling back on PROMPT
* CB-6181 android: Always execute exec() callbacks async.
* Add NOTICE file
* CB-5671 setTimeout to allow concat'ed JS to load before pluginLoader.load()
* CB-5671 Don't fail plugin loading if plugin modules are already loaded.
* CB-5438 Use jsdom-nogyp to avoid dependency on python & visual studio
* Add back "grunt btest" command
* Move all deps into devDependencies.
* CB-5438 Remove test symlinks & fix some build errors on windows.
* CB-6007 Fix findCordovaPath() not working when path contains a query param
* Update exec.js
* CB-5973 blackberry: use sync by default
* CB-5973 blackberry: add support for sync exec
* CB-5438 Exclude local symlinks from jshint
* fixes CB-5806 [Windows8] Add keepCallback support to proxy
* Set VERSION to 3.5.0-dev (via coho)
* CB-5606 WP8. Add ArrayBuffer support to exec bridge
* CB-4970 CB-5457 Switch default bridge mode to IFRAME_NAV for iOS != 5
* CB-5134 Add IFRAME_HASH based exec() bridge (all previous commits reverted).
* Revert "CB-5134 iOS - Add location.hash-based exec bridge."
* Revert "Fix broken tests take 2"
* Fix broken tests take 2
* Revert "Fix failing exec tests introduced by previous commit."
* Fix failing exec tests introduced by previous commit.
* CB-5134 iOS - Add location.hash-based exec bridge.
* CB-5604 [BlackBerry10] Switch to async XHR for exec bridge
* renaming reporter to test-reporter
* tweaking the testing infra
* temporarily removed btests, not working for me
* fixing pats require analyzer thing
* removed old runner logic into tasks
* tests passing in browser yay
* moved templates to tasks/templates and logic to tasks/lib
* begin distilling tests out
* this is long unused
* removing unused files
* grunt btest failing and not sure why
* revised readme to reflect changes to structure and gruntfile
* reverted out urlutil.exists check / save that battle for another PR
* build runs but tests borked
* fixing deps
* everything seperated into discreet modules but deps not resolved
* refactoring to small modules
* adding exists fn to urlutil and check before injecting cordova_plugins.js (failing tests)
* first pass at adding browser as a platform
* fixed licensed headers for ubuntu
* add ubuntu platform
* Spelling: SEPERATOR -> SEPARATOR
* Added amazon-fireos port to lib files + grunt file.
* CB-5316 Spell Cordova as a brand unless it's a command or script
* Set VERSION to 3.4.0-dev (via coho)
* CB-5334 [BlackBerry10] Add command proxy to exec
* CB-5307 Remove references to Callback and Incubator
* CB-5253 remove webworksready event
* CB-5253 remove webworks.exec
* CB-5247 [BlackBerry10] Map blackberry.event to document
* CB-5247 [BlackBerry10] Map blackberry.event to document
* Set VERSION to 3.3.0-dev (via coho)
* Created common exec proxy module
* [CB-4905] CordovaJS on Windows8 has memoryleak on exec.js
* made jslint a bit happier
* [CB-4942] [BlackBerry10]  deviceready is never fired     - Fix typo event.toLowerCase to type.type.toLowerCase     - Added eventListener for webworksReady to allow nativeReady to fire
* [CB-3964] Use grunt's built in jshint.
* Add RELEASENOTES.md for 3.1.0
* Change build stamp again by having it use only VERSION file on master branch
* Fix packager to not add commit hash when creating a tagged version
* Set VERSION to 3.2.0-dev (via coho)
* [CB-4761] Add cordova.platformId property
* removed unnessary console.log
* updated ffos to use win8 style commandProxy
* [CB-4149] Read version from VERSION when there is no .git/
* implement exec for firefoxos
* override init.js in the firefoxos platform for navigator fix, other bugfixes
* add firefoxos to gruntfile
* platform.js
* override init.js in the firefoxos platform for navigator fix, other bugfixes
* add firefoxos to gruntfile
* platform.js
* [all] [CB-4725] Export cordova version as "cordova.version"
* Revert "[android] Don't catch exceptions wihtin the bridge since the browser does better logging of them when uncaught."
* [android] Don't catch exceptions wihtin the bridge since the browser does better logging of them when uncaught.
* [android] Move non-plugin files out of plugins/ subdirectory.
* [android] Tweak the online bridge to tell native when an event has happened.
* [windowsphone] Use platform.bootstrap instead of platform.initialize for start-up logic.
* [win8] Move code from bootstrap-windows8.js into windows8/platform.js
* [test] Move code from bootstrap-test.js into test/platform.js
* [ios] Move code from bootstrap-ios.js into ios/platform.js
* [bb10] Move code from bootstrap-blackberry10.js into blackberry10/platform.js
* [android] Move code from bootstrap-android.js into android/platform.js
* Move bootstrap.js logic into a proper module "init.js"
* [CB-4418] Delete loadMatchingModules() and move modulemapping call into bootstrap.js (from platform.js)
* [CB-4418] Remove final symbols.js file by folding it into bootstrap.
* [all] Make pluginloader call a callback instead of firing a channel.
* [win8] Move commandProxy.js into windows8/
* [CB-4428] Delete Android storage plugin from cordova-js
* [all] Move some start-up logic from cordova.js -> bootstrap.js
* [CB-4419] Remove non-CLI bootstrap files from cordova-js.
* [CB-4419] Remove non-CLI platforms from cordova-js.
* Make base64 tests work in browser as well as Node
* Change Gruntfile to auto-build before running tests
* [CB-4420] Add a helper function for resolving relative URLs.
* [Windows8] remove all plugins
* jshint cleanup (sorry im ocd)
* [CB-4281] Moving echo to a plugin in mobilespec
* [CB-4187] Fix the fix for start-up when no plugins are installed.
* Fix grunt tests by deleting plugin-related and legacy BB tests
* [CB-4004] Fix Android JS bridge break caused by bad rebase before 5ba835c
* [CB-4187] Fix start-up stalling when no plugins are installed.
* catch exception for missing or invalid file path
* [all] [CB-3639] Remove console from core.
* [all] Fix pluginloader never finishing (broken by recent commit)
* [All] remove mistaken windows only debug message
* Fix a failure case in pluginloader where an onerror callback was not being set.
* [WP] remove plugins
* [All] patch, in case console.warn is not defined
* [All][CB-4016] plugin loading uses script injection to load cordova_plugins.js
* [all] [CB-4022] Defer running of <runs> modules until after all scripts are loaded.
* Change plugin_loader.js into a regular module that is called from bootstrap
* [CB-3193] [BlackBerry10] Remove all plugins from cordova-js
* [CB-3720] [BlackBerry10] Remove File overrides (moving to plugin)
* Use new base64 method for iOS and OSX as well
* CB 4004: Adding base64 encoding for array buffers, while removing the String expansion
* [CB-4004] Add base64 encoding utility function
* Make grunt fail if tests fail.
