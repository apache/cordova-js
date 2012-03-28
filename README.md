A unified JavaScript layer for [Apache Cordova](http://incubator.apache.org/projects/callback.html) projects.

# Project Structure

    cordova-js
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
      |  |-require.js
      |  | Our own module definition and require implementation. 
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

Make sure you have [node.js](http://nodejs.org) installed. It should come pre-installed with [npm](http://npmjs.org) - but if you install node and can't run `npm` then head over to the website and install it yourself. Make sure you have all of the node dependencies installed by running the following command from the repository root:

    npm install

All of the build tasks can be run via the `jake` node module. Install it globally first by running:

    npm install -g jake

Then from the repository root run:

    jake

This will run the `build` and `test` tasks by default. All of the available tasks are:

- `build`: creates platform versions of cordova-js and builds them into
  the `pkg/` directory.
- `test`: runs all of the unit tests inside node.
- `btest`: creates a server so you can run the tests inside a browser.
- `clean`: cleans out the `pkg/` directory

## Known Issues

- On Mac OS 10.7.3, there were issues with the contextify module not
    being able to build properly when using node v0.6.10 and running `npm
	install`. Using node v0.6.6 works, though.

# How It Works

The `build/packager.js` tool is a node.js script that concatenates all of the core Cordova plugins in this repository into a `cordova.<platform>.js` file under the `pkg/` folder. It also wraps the plugins with a RequireJS-compatible module syntax that works in both browser and node environments. We end up with a cordova.js file that wraps each Cordova plugin into its own module.

Cordova defines a `channel` module under `lib/channel.js`, which is a publish/subscribe implementation that the project uses for event management.

The Cordova native-to-webview bridge is initialized in `lib/bootstrap.js`. This file attaches the `boot` function to the `channel.onNativeReady` event - fired by native with a call to:

    cordova.require('cordova/channel).onNativeReady.fire()

The `boot` method does all the work.  First, it grabs the common platform definition (under `lib/platform/common.js`) and injects all of the objects defined there onto `window` and other global namespaces. Next, it grabs all of the platform-specific object definitions (as defined under `lib/platform/<platform>.js`) and overrides those onto `window`. Finally, it calls the platform-specific `initialize` function (located in the platform definition). At this point, Cordova is fully initialized and ready to roll. Last thing we do is wait for the `DOMContentLoaded` event to fire to make sure the page has loaded properly. Once that is done, Cordova fires the `deviceready` event where you can safely attach functions that consume the Cordova APIs.

# Testing

Tests run in node or the browser. To run the tests in node:
    
    jake test

To run them in the browser:

    jake btest

Final testing should always be done with the [Mobile Spec test application](https://github.com/apache/incubator-cordova-mobile-spec).

# Integration

## Cordova

Build the .js file and drop it in as a replacement for cordova.js.

### Supported Platforms

- Android

## Ripple

Load this in Ripple to play with it. You will have to use the cordova prototype branch to better simulate the phone environment and use this javascript rather than Ripples emulated code.

    git clone git@github.com:blackberry-webworks/Ripple-UI.git
    git checkout winnie.the.pooh
    ./configure
    jake

and then load the upacked extension in chrome in the pkg/chromium folder. Use the cordova.proto platform in ripple.

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
2. Define your platform definition object and name it <platform>.js. Drop this into the `lib/platform` folder. This file should contain a JSON object with the following properties:
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
    - `initialize`: a function that fires immediately after the `objects` (see above) are defined in the global scope
   
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

3. You should probably add a `packager.bundle('<platform>')` call to the `Jakefile`.
4. Make sure your native implementation executes the following JavaScript once all of the native side is initialized and ready: `require('cordova/channel').onNativeReady.fire()`.

# Cordova-specific TODOs Before Final Integration

- Add a section about authoring plugins for cordova.
- Related to above, come up with a consistent sensor plugin API.
  Functions like `getCurrent<data>` and `watch<data>` can be abstracted
  into a nice plugin. Compass, Accel, Geo should all be basically the
  same implementation. For example, on Android geo + accel handle
  calling `start` (starting the listener) in the native code on its own.
  However, Compass requires that JS initiates a `start`. This is dumb.
- Media (and other plugin) implementations across platforms need to use the established
  cordova/exec callback method (instead of triggering globally-accessible functions to 
  dispatch listeners). On iOS, grep for "cast" in the native
  code - you'll see a bunch of invoked JavaScript from native, which
  shouldn't be there.
- Media needs updates across all platforms. Methods need fixing with
  respect to timing: some methods use milliseconds, some use seconds.
  Some methods not documented (setVolume on Android). Consolidate /
  implement properly across platforms.
- Normalize `Entry.toURL` return values. iOS returns `"file://localhost" +
  fullPath`, Android returns `"file://" + fullPath`, BlackBerry returns just `fullPath`
- APIs that are not cross-platform - what
  to do with these?
  - Crypto on Android
  - SMS, telephony, splashscreen on iOS
- Once-over all of the cordova-docs with the APIs defined in here to
  make sure all is consistent. There were function signature tweaks,
  undocumented procedures, etc.

# TODO / Hacking / Contributing

- implementations:
  - BlackBerry: button + app + contact + file + others (need to once-over)
  - all of Playbook
  - everything for WP7
  - everything for Bada
- tests for channel, pretty much everything under lib/plugin
- think about whether to select and load the platform specific modules at
  runtime or at buildtime. what about platform-specific overrides? can
  we at buildtime decide to include only the overrides (to save a few
  kb?). what about specifically denoting modules to include/exclude on a
  per-platform basis?
- 3rd party plugins could be interesting. Need a little bit more thought about how these will fit into the system. I am thinking a package.json type file to handle per plugin.

