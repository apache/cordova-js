/**
 * This class contains information about the current battery status.
 * @constructor
 */
var phonegap = require('phonegap'),
    exec = require('phonegap/exec');

var Battery = function() {
    this._level = null;
    this._isPlugged = null;
    // Create new event handlers on the window (returns a channel instance)
    var subscriptionEvents = {
      onSubscribe:this.onSubscribe,
      onUnsubscribe:this.onUnsubscribe
    };
    this.channels = {
      batterystatus:phonegap.addWindowEventHandler("batterystatus", subscriptionEvents),
      batterylow:phonegap.addWindowEventHandler("batterylow", subscriptionEvents),
      batterycritical:phonegap.addWindowEventHandler("batterycritical", subscriptionEvents)
    };
};
/**
 * Event handlers for when callbacks get registered for the battery.
 * Keep track of how many handlers we have so we can start and stop the native battery listener
 * appropriately (and hopefully save on battery life!).
 */
Battery.prototype.onSubscribe = function() {
  var me = navigator.battery; // TODO: i dont like this reference
  // If we just registered the first handler, make sure native listener is started.
  if ((me.channels.batterystatus.handlers.length + me.channels.batterylow.handlers.length + me.channels.batterycritical.handlers.length) === 1) {
    exec(me._status, me._error, "Battery", "start", []);
  }
};

Battery.prototype.onUnsubscribe = function() {
  var me = navigator.battery; // TODO: i dont like this reference
  // If we just unregistered the last handler, make sure native listener is stopped.
  if ((me.channels.batterystatus.handlers.length + me.channels.batterylow.handlers.length + me.channels.batterycritical.handlers.length) === 0) {
    exec(null, null, "Battery", "stop", []);
  }
};

/**
 * Callback for battery status
 * 
 * @param {Object} info			keys: level, isPlugged
 */
Battery.prototype._status = function(info) {
	if (info) {
		var me = navigator.battery;//TODO: can we eliminate this global ref?
    var level = info.level;
		if (me._level !== level || me._isPlugged !== info.isPlugged) {
			// Fire batterystatus event
			phonegap.fireWindowEvent("batterystatus", info);

			// Fire low battery event
			if (level === 20 || level === 5) {
				if (level === 20) {
					phonegap.fireWindowEvent("batterylow", info);
				}
				else {
					phonegap.fireWindowEvent("batterycritical", info);
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

module.exports = new Battery();
