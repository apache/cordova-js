/**
 * This class contains information about the current battery status.
 * @constructor
 */
var cordova = require('cordova'),
    exec = require('cordova/exec');

function handlers() {
  return battery.channels.batterystatus.numHandlers + 
         battery.channels.batterylow.numHandlers +
         battery.channels.batterycritical.numHandlers;
}

var Battery = function() {
    this._level = null;
    this._isPlugged = null;
    // Create new event handlers on the window (returns a channel instance)
    var subscriptionEvents = {
      onSubscribe:this.onSubscribe,
      onUnsubscribe:this.onUnsubscribe
    };
    this.channels = {
      batterystatus:cordova.addWindowEventHandler("batterystatus", subscriptionEvents),
      batterylow:cordova.addWindowEventHandler("batterylow", subscriptionEvents),
      batterycritical:cordova.addWindowEventHandler("batterycritical", subscriptionEvents)
    };
};
/**
 * Event handlers for when callbacks get registered for the battery.
 * Keep track of how many handlers we have so we can start and stop the native battery listener
 * appropriately (and hopefully save on battery life!).
 */
Battery.prototype.onSubscribe = function() {
  var me = battery;
  // If we just registered the first handler, make sure native listener is started.
  if (handlers() === 1) {
    exec(me._status, me._error, "Battery", "start", []);
  }
};

Battery.prototype.onUnsubscribe = function() {
  var me = battery;

  // If we just unregistered the last handler, make sure native listener is stopped.
  if (handlers() === 0) {
      exec(null, null, "Battery", "stop", []);
  }
};

/**
 * Callback for battery status
 * 
 * @param {Object} info            keys: level, isPlugged
 */
Battery.prototype._status = function(info) {
    if (info) {
        var me = battery;
    var level = info.level;
        if (me._level !== level || me._isPlugged !== info.isPlugged) {
            // Fire batterystatus event
            cordova.fireWindowEvent("batterystatus", info);

            // Fire low battery event
            if (level === 20 || level === 5) {
                if (level === 20) {
                    cordova.fireWindowEvent("batterylow", info);
                }
                else {
                    cordova.fireWindowEvent("batterycritical", info);
                }
            }
        }
        me._level = level;
        me._isPlugged = info.isPlugged;    
    }
};

/**
 * Error callback for battery start
 */
Battery.prototype._error = function(e) {
    console.log("Error initializing Battery: " + e);
};

var battery = new Battery();

module.exports = battery;
