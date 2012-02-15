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
      |  | Injects in our classes onto window and navigator (or wherever else is needed)
      |  |
      |  |-channel.js
      |  | A pub/sub implementation to handle custom framework events 
      |  |
      |  |-cordova.js
      |  | Common Cordova stuff such as callback handling and
      |  | window/document add/removeEventListener hijacking 
      |  | 
      |  |-utils.js
      |  | General purpose JS utility stuff: closures, uuids, object
      |  | cloning, extending prototypes
      |  |
      |  |-exec/
      |  | Contains the platform specific definitions of the exec method
      |  |
      |  |-platform/
      |  | Definitions of each platform that help us describe where
      |  | and what to put on the window object, and what to run to
      |  | initialize the platform. A common set of globals are also
      |  | defined (common.js)
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

# How It Works

The `build/packager.js` tool is a node.js script that concatenates and
wraps various .js files with a RequireJS-compatible module syntax in this
project together to generate cordova.js files that are compatible
to the various supported platforms. Check that script out to figure out
how and in what order the various files are concatenated together.

We end up with a script file that has a ton of `define` calls, wrapping
each Cordova API or object into its own module. Next, the Cordova bridge is initialized with the
help of `lib/bootstrap.js`. This file attaches the `_self.boot` function
once the `channel.onNativeReady` event is fired - which should be fired
from the native side (native should call `require('cordova/channel).onNativeReady.fire()`).
Finally, the `boot` method is where the magic happens.  First, it grabs
the common platform definition (as defined under
`lib/platform/common.js`) and injects all the objects defined in there
onto `window` and other global namespaces. Next, it grabs all of the platform-specific object
definitions (as defined under `lib/platform/<platform>.js`) and
overrides those onto `window`. Finally, it calls the platform-specific
`initialize` function (located in the platform definition). At this
point, Cordova is fully initialized and ready to roll, however, before
the `deviceready` event is fired, we still wait for the
`DOMContentLoaded` event to fire to make sure the page has loaded
properly.

# Testing

Tests run in node or the browser, and you can launch them with :
    
    jake test

or to run in the browser:

    jake btest


Coming soon, nodeJS running of tasks!

Final testing should always be done with the [Mobile Spec test application](https://github.com/apache/incubator-cordova-mobile-spec).

# Integration

## Cordova

Build the .js file and drop it in as a replacement for cordova.js or
cordova.js!

## Ripple

Load this in Ripple to play with it. You will have to use the cordova
prototype branch to better simulate the phone environment and use this
javascript rather than Ripples emulated code.

    git clone git@github.com:blackberry-webworks/Ripple-UI.git
    git checkout winnie.the.pooh
    ./configure
    jake

and then load the upacked extension in chrome in the pkg/chromium folder.
Use the cordova.proto platform in ripple.

# Adding a New Platform

1. Write a module that encapsulates your platform's `exec` method and
   call it <platform>.js. The `exec` method is a JavaScript function
   that enables communication from the platform's JavaScript environment
   into the platform's native environment. Each platform uses a different
   mechanism to enable this bridge. We recommend you check out the other
   platform `exec` definitions for inspiration. Drop this into the
   `lib/exec` folder. The `exec` method has the following method
   signature: `function(success, fail, service, action, args)`, with the
   following parameters:
  - `success`: a success function callback
  - `fail`: a failure function callback
  - `service`: a string identifier that the platform can resolve to a
    native class
  - `action`: a string identifier that the platform can resolve to a
    specific method inside the class pointed to by `service`
  - `args`: an array of parameters to pass to the native method invoked
    by the `exec` call
   It is required that new platform additions be as consistent as
   possible with the existing `service` and `action` labels.
2. Define your platform definition object and name it <platform>.js.
   Drop this into the `lib/platform` folder. This file should contain a
   JSON object with the following properties:
    - `id`: a string representing the platform. This should be the same
      name the .js file has
    - `objects`: the property names defined as children of this property
      are injected into `window`. Each property can have the following
      child properties:
      - `path`: a string representing the module ID that will define
        this object. For example, the file `lib/plugin/accelerometer.js`
        can be accessed as `"cordova/plugin/accelerometer"`. More details on how
        the module IDs are defined are above under the "How It Works" section.
      - `children`: in a recursive fashion, can have `path` and
        `children` properties of its own that are defined as children of
        the parent property object
    - `initialize`: a function that fires immediately after the the
      `objects` (see above) are defined in the global scope
   
   The following is a simple example of a platform definition:

    <pre>
    {
      id:"atari",
      initialize:function(){
        console.log('firing up cordova in my atari, yo.');
      },
      objects:{
        cordova:{
          path:"cordova",
          children:{
            joystick:{
              path:"cordova/plugin/atari/joystick"
            }
          }
        }
      }
    }
    </pre>

3. You should probably add a `packager.bundle('<platform>')`
   call to the `Jakefile`.
4. Make sure your native implementation executes the following
   JavaScript once all of the native side is initialized and ready:
   `require('cordova/channel').onNativeReady.fire()`.


# Cordova-specific TODOs Before Final Integration

- Related to above, come up with a consistent sensor plugin API.
  Functions like `getCurrent<data>` and `watch<data>` can be abstracted
  into a nice plugin. Compass, Accel, Geo should all be basically the
  same implementation. For example, on Android geo + accel handle
  calling `start` (starting the listener) in the native code on its own.
  However, Compass requires that JS initiates a `start`. This is dumb.
- Media (and other plugin) implementations across platforms need to use the established
  cordova/exec callback method (instead of triggering globally-accessible functions to 
  dispatch listeners). On iOS and Android, grep for "cast" in the native
  code - you'll see a bunch of invoked JavaScript from native, which
  shouldn't be there.
- Media needs updates across all platforms. Methods need fixing with
  respect to timing: some methods use milliseconds, some use seconds.
  Some methods not documented (setVolume on Android). Consolidate /
  implement properly across platforms.
- Storage shim on Android needs to change its win/fail callbacks to
  `require('cordova/plugin/android/storage').failQuery / completeQuery`
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
  the appropriate cordova channel after `device` is ready on iOS.

# TODO / Hacking / Contributing

- implementations:
  button + app + contact + file + others (need to once-over) (BB), Playbook, everything for WP7,
  everything for Bada, any other platforms I missed...
- specs: channel, pretty much everything under lib/plugin
- think about whether to select and load the platform specific modules at
  runtime or at buildtime. what about platform-specific overrides? can
  we at buildtime decide to include only the overrides (to save a few
  kb?). what about specifically denoting modules to include/exclude on a
  per-platform basis?
- 3rd party plugins could be interesting. Need a little bit more thought about how these will fit into the system. I am thinking a package.json type file to handle per plugin.
