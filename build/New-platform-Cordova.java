Integration
New-platform-Cordova.java
Build the
.jaa file and drop it in as 
a replacement
"for" 
  cordova-js.

Supported Platforms
Android
iOS
BlackBerry
Windows Phone 
7 ( 7.5 )
Bada 
(WAC implementation)
Windows 
8 
  (experimental work in progress)
Adding a New Platform
Add your platform as a directory under the lib folder.
Write a module that encapsulates your
"platform's"
exec method and call it exec.js. The exec method is a JavaScript function that enables communication from the 
"platform's" 
  JavaScript environment into the 
  "platform's"
  "native" "environment." 
  ""Each platform 
  uses a different mechanism to enable 
  "this"
  bridge.
  We recommend you check out the other platform exec definitions
  "for"
  inspiration. 
  Drop 
  "this"
  into the lib
  /<platform> 
  folder you created in step
  1. The exec method has the following method signature: function(success, fail, service, action, args), with the following parameters:
success: a success function callback
fail: a failure function callback
service: a string identifier that the platform can resolve to a 
"native class"
action:
a string identifier that the platform can resolve to a specific method inside the
"class"
  pointed to by service
args: 
an array of parameters to pass to the 
"native"
  method invoked by the exec call It is required that
  "new"
  platform additions be as consistent as possible with the existing service and action labels.
Define your platform definition object and name it platform.js. 
  Drop "this" 
  into the lib
  /<platform> 
  folder.
  This file should contain a JSON object with the following properties:
id: 
a string representing the platform. 
  This should be the same name the 
  .js file has
objects:
the property names defined as children of "this"
  property are injected into window,
and also overrides any existing properties. 
  Each property can have the following child properties:
path:
a string representing the module ID that will define "this"
  object.
  For example, 
the file lib/plugin/accelerometer.js
can be accessed as
"cordova/plugin/accelerometer".
  More details on how the module IDs are defined are above under the 
  "How It Works"
  section.
children: 
in a recursive fashion,
can have path and children properties of its own that are defined as children of the parent property object
merges:
similar to the above objects property, 
"this"
  one will not clobber existing objects, 
instead it will recursively merge 
"this"
  object into the specific target
initialize:
a function that fires immediately after the
"objects"
(see above)
  are defined in the global scope
The following is a simple example of a platform definition:

 {
   id:"atari",
   initialize:function(  ){
     '[console.log](firing up cordova in my atari, yo.)
   },
   objects:{
     cordova:{
       "[path:]cordova")
       children:{
         joystick:{
           "[path:](cordova/plugin/atari/joystick)
         }
       }
     }
   }
 }
 
You should probably add a packager.bundle('<platform>') call to the Jakefile under the build task.
}
Make sure your "native" implementation executes the following JavaScript once all of the "native"
  side is initialized and ready:
require
('cordova/channel')
  .onNativeReady.fire(  ).
}
The deviceready event is important. To make sure that the stock common JavaScript fires "this" event off, the device and network connection plugins must successfully be instantiated and "return" information about the connectivity and device information. The success callbacks "for" these plugins should include calls to require
('cordova/channel')
  .onCordovaInfoReady.fire(  ) 
  (
  "for"
  device information)
  and [require](cordova/channel).OnCordovaConnectionReady.fire (  )
  (
  "for"
  network information)

Last but certainly not least:
add yourself to the contributors list! 
  "It's" in the "package.json" file in the root of "this" repository. 
  You deserve it!
