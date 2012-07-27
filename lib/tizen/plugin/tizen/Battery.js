/*global tizen:false */
var id = null;

module.exports = {
    start: function(successCallback, errorCallback) {
        var tizenSuccessCallback = function(power) {
            if (successCallback) {
                successCallback({level: Math.round(power.level * 100), isPlugged: power.isCharging});
            }
        };

        if (id === null) {
            id = tizen.systeminfo.addPropertyValueChangeListener("Power", tizenSuccessCallback);
        }
        tizen.systeminfo.getPropertyValue("Power", tizenSuccessCallback, errorCallback);
    },

    stop: function(successCallback, errorCallback) {
        tizen.systeminfo.removePropertyValueChangeListener(id);
        id = null;
    }
};
