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

all you can do right now is require in some modules:

     var PhoneGap = require("phonegap");

and .... thats about it. 

#todo

- figure out the bootstrap
- add in a platform builder to build up navigator
- think more about what it means to run in node
