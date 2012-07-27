var cordova = require('cordova');

/**
 * Called by native code to retrieve all queued commands and clear the queue.
 */
module.exports = function() {
  // Each entry in commandQueue is a JSON string already.
  var json = '[' + cordova.commandQueue.join(',') + ']';
  cordova.commandQueue.length = 0;
  return json;
};
