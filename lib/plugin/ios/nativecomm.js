var cordova = require('cordova');

/**
 * Called by native code to retrieve all queued commands and clear the queue.
 */
module.exports = function() {
  var json = JSON.stringify(cordova.commandQueue);
  cordova.commandQueue = [];
  return json;
};
