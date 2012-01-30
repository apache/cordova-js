A unified JavaScript layer for [Apache Cordova](http://incubator.apache.org/projects/callback.html) projects.

# Project Structure

    callback-js
      |
      |-build/
      | Will contain any build modules (currently nothing here as it is all hacked
      | into the JakeFile)
      |
      |-lib
      |  |-bootstrap.js
      |  | Code to bootstrap the Cordova platform, inject APIs and fire events
      |  |
      |  |-builder.js
      |  | Injects in our classes onto navigator (or wherever else is needed)
      |  |
      |  |-channel.js
      |  | A pub/sub implementation to handle custom framework events 
      |  |
      |  |-phonegap.js
      |  | Common Cordova stuff such as callback handling and
      |  | window/document add/removeEventListener hijacking 
      |  | 
      |  |-utils.js
      |  | General purpose JS utility stuff: closures, uuids, object
      |  | cloning
      |  |
      |  |-exec/
      |  | Will contain the platform specific definitaions of the exec method. 
      |  | Thinking of maybe renaming/repurposing this for any other platform
      |  | specific quirks
      |  |
      |  |-platform/
      |  | Definitions of each platform that help us describe where
      |  | and what to put on the window object, and what to run to
      |  | initialize the platform. A common set of globals are also
      |  | defined (common.js). Each file is a JSON object with the
      |  | following properties:
      |  | 
      |  |  {
      |  |    id:"atari", // a string representing the platform id
      |  |    initialize:function(){}, // function to run any platform-specific initialization
      |  |    objects:{ // properties of this object define globals that get either injected onto `window` or mixed into existing `window` objects
      |  |      PhoneGap:{
      |  |        path:"phonegap", // a requirejs-compatible path to the .js file to use for the object.
      |  |        children:{ // properties of this object are added to the parent object, i.e. in this example the defined children will be added to the `PhoneGap` global.
      |  |          path:"phonegap/somedir/other" // specify either a path to the .js file to use for the child
      |  |        }
      |  |      }
      |  |    }
      |  |  }
      |  |
      |  |-plugin/
      |  |  | All API definitions as plugins, ones common to all
      |  |  | platforms reside at the top level...
      |  |  `-<platform>
      |  |    ... and platform-specific ones reside in their respective
      |  |    folders

# Building

Just make sure you have `node`, `npm` and `jake` installed and run:

    jake

It will build into the `./pkg` folder.

# Testing

Launch `./test/index.html` to run the suite of tests for each module / plugin.

Coming soon, nodeJS running of tasks!

Final testing should always be done with the [Mobile Spec test application](https://github.com/apache/incubator-cordova-mobile-spec).

# Integration

## Cordova

Build the .js file and drop it in as a replacement for phonegap.js!

## Ripple

Load this in Ripple to play with it. You will have to use the phonegap
prototype branch to better simulate the phone environment and use this
javascript rather than Ripples emulated code.

    git clone git@github.com:blackberry-webworks/Ripple-UI.git
    git checkout winnie.the.pooh
    ./configure
    jake

and then load the upacked extension in chrome in the pkg/chromium folder.
Use the phonegap.proto platform in ripple.

# Adding a New Platform

FILL THIS OUT YO!

# Cordova-specific TODOs Before Final Integration

- Consolidate the native geolocation plugin implementation; need a
  consistent native API. (post to dev list about this). Perhaps review
  how necessary this plugin is now on modern platform versions?
- Related to above, come up with a consistent sensor plugin API.
  Functions like `getCurrent<data>` and `watch<data>` can be abstracted
  into a nice plugin. Compass, Accel, Geo should all be basically the
  same implementation. For example, on Android geo + accel handle
  calling `start` (starting the listener) in the native code on its own.
  However, Compass requires that JS initiates a `start`. This is dumb.
- Media (and other plugin) implementations across platforms need to use the established
  phonegap/exec callback method (instead of triggering globally-accessible functions to 
  dispatch listeners). On iOS and Android, grep for "cast" in the native
  code - you'll see a bunch of invoked JavaScript from native, which
  shouldn't be there.
- Media needs updates across all platforms. Methods need fixing with
  respect to timing: some methods use milliseconds, some use seconds.
  Some methods not documented (setVolume on Android). Consolidate /
  implement properly across platforms.
- Storage shim on Android needs to change its win/fail callbacks to
  `require('phonegap/plugin/android/storage').failQuery / completeQuery`
  (away from droiddb.fail / completeQuery)
- Make sure all of the service + action parameters in each `exec` call
  is consistent across all platforms. Specifically, iOS needs to update
  to the Android and BlackBerry plugin labels.
- Normalize `Entry.toURL` return values. iOS returns `"file://localhost" +
  fullPath`, Android returns `"file://" + fullPath`, BlackBerry returns just `fullPath`
- APIs that are not cross-platform - what
  to do with these?
  - Crypto on Android
  - SMS, telephony, splashscreen on iOS
- Need to normalize native return values as much as possible across
  platforms. For example, error objects. Should we return JSON objects
  from native or minimal primitives (i.e. error codes as numbers)? Both
  are in use today, we need to decide on a standard.
- Port all of the unit-testy stuff from mobile spec over to this
  project. Have mobile spec as a defacto functional/integration test.
- Once-over all of the cordova-docs with the APIs defined in here to
  make sure all is consistent. There were function signature tweaks,
  undocumented procedures, etc.
- Initialization of `device` in iOS needs to be upgraded. No more
  `DeviceInfo` global object if possible. Also need to make sure to fire
  the appropriate phonegap channel after `device` is ready on iOS.

# TODO / Hacking / Contributing

- implementations: geolocation + position/error (all),
  button + app + contact + file + others (need to once-over) (BB), everything for WP7,
  everything for Bada, any other platforms I missed...
- docs: adding new platform, `require('path')` pathing transformation
  from `./build/packager.js`
- think more about what it means to run in node
- think about whether to select and load the platform specific modules at
  runtime or at buildtime. what about platform-specific overrides? can
we at buildtime decide to include only the overrides (to save a few
kb?)
- 3rd party plugins could be interesting. Need a little bit more thought about how these will fit into the system. I am thinking a package.json type file to handle per plugin.
