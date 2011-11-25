# PhoneGap.js Module Prototype

Just a scratchpad to prototype what having a common javascript
layer for PhoneGap would look like if we used a module based
pattern.

Everything here Is kinda a hack at the moment so please take it 
will a grain of salt.  Currently:

# building

Just make sure you have node, npm and jake installed and run:

    jake

it will build into the pkg folder.  You can load up test/smoke.htm 
as it includes the build copy.

Load this in ripple to play with it. You will have to use the phonegap
prototype branch to better simulate the phone environment and use this
javascript rather than Ripples emulated code.

    git clone git@github.com:blackberry-webworks/Ripple-UI.git
    git checkout winnie.the.pooh
    ./configure
    jake

and then load the upacked extension in chrome in the pkg/chromium folder.
Use the phonegap.proto platform in ripple.

#todo

- figure out the bootstrap
- add in a platform builder to build up navigator
- think more about what it means to run in node
- think about weather to select and load the platform specific modules at
  runtime or at buildtime.

