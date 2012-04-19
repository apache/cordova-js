A unified JavaScript layer for [Apache Cordova](http://incubator.apache.org/projects/callback.html) projects.

# Project Structure

    cordova-js
      |
      |-build/
      | Will contain any build modules (currently nothing here as it is all
      | hacked into the JakeFile)
      |
      |-lib
      |  |-cordova.js
      |  | Common Cordova stuff such as callback handling and
      |  | window/document add/removeEventListener hijacking 
      |  | 
      |  |-common/
      |  | Contains the common-across-platforms base modules
      |  |
      |  |-common/builder.js
      |  | Injects in our classes onto window and navigator (or wherever else 
      |  | is needed)
      |  |
      |  |-common/channel.js
      |  | A pub/sub implementation to handle custom framework events 
      |  |
      |  |-common/common.js
      |  | Common locations to add Cordova objects to browser globals.
      |  |
      |  |-common/exec.js
      |  | Stub for platform's specific version of exec.js
      |  |
      |  |-common/platform.js
      |  | Stub for platform's specific version of platform.js
      |  |
      |  |-common/utils.js
      |  | General purpose JS utility stuff: closures, uuids, object
      |  | cloning, extending prototypes
      |  |
      |  |-common/plugin
      |  | Contains the common-across-platforms plugin modules
      |  |
      |  |-scripts/
      |  | Contains non-module JavaScript source that gets added to the
      |  | resulting cordova.<platform>.js files closures, uuids, object
      |  |
      |  |-scripts/bootstrap.js
      |  | Code to bootstrap the Cordova platform, inject APIs and fire events
      |  |
      |  |-scripts/require.js
      |  | Our own module definition and require implementation. 
      |  |
      |  |-<platform>/
      |  | Contains the platform-specific base modules.
      |  |
      |  |-<platform>/plugin/<platform>
      |  | Contains the platform-specific plugin modules.

The way the resulting `cordova.<platform>.js` files will be built is by combining the scripts in the `lib/scripts` directory with modules from the `lib/common` and `lib/<platform>` directories.  For cases where there is the same named module in `lib/common` and `lib/<platform>/plugin/<platform>`, the `lib/<platform>` version wins.  For instance, every `lib/<platform>` includes an `exec.js`, and there is also a version in `lib/common`, so the `lib/<platform>` version will always be used.  In fact, the `lib/common` one will throw errors, so if you build a new platform and forget `exec.js`, the resulting `cordova.<platform>.js` file will also throw errors.

# Building

Make sure you have [node.js](http://nodejs.org) installed. It should come pre-installed with [npm](http://npmjs.org) - but if you install node and can't run `npm` then head over to the website and install it yourself. Make sure you have all of the node dependencies installed by running the following command from the repository root:

    npm install

All of the build tasks can be run via the `jake` node module. Install it globally first by running:

    sudo npm install -g jake

Every build also runs the scripts through [JSHint](). It is best
installed globally:

    sudo npm install -g jshint

Then from the repository root run:

    jake

This will run the `build`, `hint` and `test` tasks by default. All of the available tasks are:

- `build`: creates platform versions of cordova-js and builds them into
  the `pkg/` directory
- `test`: runs all of the unit tests inside node
- `btest`: creates a server so you can run the tests inside a browser
- `clean`: cleans out the `pkg/` directory
- `hint`: runs all of the script files through JSHint
- `fixtabs`: converts all tabs to four spaces within the script files

## Known Issues

- On Mac OS 10.7.3, there were issues with the contextify module not
    being able to build properly when using node v0.6.10 and running `npm
	install`. Using node v0.6.6 works, though.

# How It Works

The `build/packager.js` tool is a node.js script that concatenates all of the core Cordova plugins in this repository into a `cordova.<platform>.js` file under the `pkg/` folder. It also wraps the plugins with a RequireJS-compatible module syntax that works in both browser and node environments. We end up with a cordova.js file that wraps each Cordova plugin into its own module.

Cordova defines a `channel` module under `lib/common/channel.js`, which is a publish/subscribe implementation that the project uses for event management.

The Cordova native-to-webview bridge is initialized in `lib/scripts/bootstrap.js`. This file attaches the `boot` function to the `channel.onNativeReady` event - fired by native with a call to:

    cordova.require('cordova/channel).onNativeReady.fire()

The `boot` method does all the work.  First, it grabs the common platform definition (under `lib/common/common.js`) and injects all of the objects defined there onto `window` and other global namespaces. Next, it grabs all of the platform-specific object definitions (as defined under `lib/<platform>/platform.js`) and overrides those onto `window`. Finally, it calls the platform-specific `initialize` function (located in the platform definition). At this point, Cordova is fully initialized and ready to roll. Last thing we do is wait for the `DOMContentLoaded` event to fire to make sure the page has loaded properly. Once that is done, Cordova fires the `deviceready` event where you can safely attach functions that consume the Cordova APIs.

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
- iOS
- BlackBerry
- Windows Phone 7 Mango

## Ripple

Load this in Ripple to play with it. You will have to use the cordova prototype branch to better simulate the phone environment and use this javascript rather than Ripples emulated code.

    git clone git@github.com:blackberry-webworks/Ripple-UI.git
    git checkout winnie.the.pooh
    ./configure
    jake

and then load the upacked extension in chrome in the pkg/chromium folder. Use the cordova.proto platform in ripple.

# Adding a New Platform

1. Add your platform as a directory under the `lib` folder.
2. Write a module that encapsulates your platform's `exec` method and
   call it exec.js. The `exec` method is a JavaScript function
   that enables communication from the platform's JavaScript environment
   into the platform's native environment. Each platform uses a different
   mechanism to enable this bridge. We recommend you check out the other
   platform `exec` definitions for inspiration. Drop this into the
   `lib/<platform>` folder you created in step 1. The `exec` method has the following method
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
2. Define your platform definition object and name it platform.js. Drop this into the `lib/<platform>` folder. This file should contain a JSON object with the following properties:
    - `id`: a string representing the platform. This should be the same
      name the .js file has
    - `objects`: the property names defined as children of this property
      are injected into `window`, and also *overrides any existing
      properties*. Each property can have the following
      child properties:
      - `path`: a string representing the module ID that will define
        this object. For example, the file `lib/plugin/accelerometer.js`
        can be accessed as `"cordova/plugin/accelerometer"`. More details on how
        the module IDs are defined are above under the "How It Works" section.
      - `children`: in a recursive fashion, can have `path` and
        `children` properties of its own that are defined as children of
        the parent property object
    - `merges`: similar to the above `objects` property, this one will
      not clobber existing objects, instead it will recursively merge
      this object into the specific target
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

3. You should probably add a `packager.bundle('<platform>')` call to the `Jakefile` under the `build` task.
4. Make sure your native implementation executes the following JavaScript once all of the native side is initialized and ready: `require('cordova/channel').onNativeReady.fire()`.
5. The deviceready event is important. To make sure that the stock
   common JavaScript fires this event off, the device and network
   connection plugins must successfully be instantiated and return
   information about the connectivity and device information. The
   success callbacks for these plugins should include calls to
   `require('cordova/channel').onCordovaInfoReady.fire()` (for device
   information) and
   `require('cordova/channel').OnCordovaConnectionReady.fire()` (for
   network information).
6. Last but certainly not least: add yourself to the contributors list!
   It's in the `package.json` file in the root of this repository. You
   deserve it!
