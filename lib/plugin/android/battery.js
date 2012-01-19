/**
 * This class contains information about the current battery status.
 * @constructor
 */
var phonegap = require('phonegap'),
    exec = require('phonegap/exec');

var Battery = function() {
    this._level = null;
    this._isPlugged = null;
    this._batteryListener = [];
    this._lowListener = [];
    this._criticalListener = [];
    // Attach event handlers to window
    phonegap.addWindowEventHandler("batterystatus", this.eventHandler);
    phonegap.addWindowEventHandler("batterylow", this.eventHandler);
    phonegap.addWindowEventHandler("batterycritical", this.eventHandler);
};

/**
 * Registers as an event producer for battery events.
 * 
 * @param {Object} eventType
 * @param {Object} handler
 * @param {Object} add
 */
Battery.prototype.eventHandler = function(eventType, handler, add) {
    var me = navigator.battery;
    if (add) {
        // If there are no current registered event listeners start the battery listener on native side.
        if (me._batteryListener.length === 0 && me._lowListener.length === 0 && me._criticalListener.length === 0) {
            exec(me._status, me._error, "Battery", "start", []);
        }
        
        // Register the event listener in the proper array
        if (eventType === "batterystatus") {
            if (me._batteryListener.indexOf(handler) === -1) {
                me._batteryListener.push(handler);
            }
        } else if (eventType === "batterylow") {
            if (me._lowListener.indexOf(handler) === -1) {
                me._lowListener.push(handler);
            }
        } else if (eventType === "batterycritical") {
            if (me._criticalListener.indexOf(handler) === -1) {
                me._criticalListener.push(handler);
            }
        }
    } else {
        var pos = -1;
        // Remove the event listener from the proper array
        if (eventType === "batterystatus") {
            pos = me._batteryListener.indexOf(handler);
            if (pos > -1) {
                me._batteryListener.splice(pos, 1);        
            }
        } else if (eventType === "batterylow") {
            pos = me._lowListener.indexOf(handler);
            if (pos > -1) {
                me._lowListener.splice(pos, 1);        
            }
        } else if (eventType === "batterycritical") {
            pos = me._criticalListener.indexOf(handler);
            if (pos > -1) {
                me._criticalListener.splice(pos, 1);        
            }
        }
        
        // If there are no more registered event listeners stop the battery listener on native side.
        if (me._batteryListener.length === 0 && me._lowListener.length === 0 && me._criticalListener.length === 0) {
            exec(null, null, "Battery", "stop", []);
        }
    }
};

/**
 * Callback for battery status
 * 
 * @param {Object} info			keys: level, isPlugged
 */
Battery.prototype._status = function(info) {
	if (info) {
		var me = this;
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
