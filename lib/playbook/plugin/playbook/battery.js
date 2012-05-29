var cordova = require('cordova');

module.exports = {
    start: function (args, win, fail) {
        // Register one listener to each of level and state change
        // events using WebWorks API.
        blackberry.system.event.deviceBatteryStateChange(function(state) {
            var me = navigator.battery;
            // state is either CHARGING or UNPLUGGED
            if (state === 2 || state === 3) {
                var info = {
                    "level" : me._level,
                    "isPlugged" : state === 2
                };

                if (me._isPlugged !== info.isPlugged && typeof win === 'function') {
                    win(info);
                }
            }
        });
        blackberry.system.event.deviceBatteryLevelChange(function(level) {
            var me = navigator.battery;
            if (level != me._level && typeof win === 'function') {
                win({'level' : level, 'isPlugged' : me._isPlugged});
            }
        });

        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "WebWorks Is On It" };
    },
    stop: function (args, win, fail) {
        // Unregister battery listeners.
        blackberry.system.event.deviceBatteryStateChange(null);
        blackberry.system.event.deviceBatteryLevelChange(null);
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "WebWorks Is On It" };
    }
};
