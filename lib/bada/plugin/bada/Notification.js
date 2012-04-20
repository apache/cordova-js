module.exports = {
    alert: function(message, alertCallback, title, buttonName) {
        alert(message);
    },
    confirm: function(message, confirmCallback, title, buttonLabels) {
        alert(message);
    },
    beep: function(times, milliseconds) {
        try {
            deviceapis.deviceinteraction.stopNotify();
            if(times == 0) {
                return;
            }
            deviceapis.deviceinteraction.startNotify(function() {
                console.log("Notifying");
            },
            function(e) {
                console.log("Failed to notify: " + e);
            },
            milliseconds);
            Osp.Core.Function.delay(this.beep, 1000+milliseconds, this, times - 1, milliseconds);
        }
        catch(e) {
            console.log("Exception thrown: " + e);
        }
    },
    vibrate: function(milliseconds) {
        try {
            deviceapis.deviceinteraction.startVibrate(function() {
                console.log("Vibrating...");
            },
            function(e) {
                console.log("Failed to vibrate: " + e);
            },
            milliseconds);
        }
        catch(e) {
            console.log("Exception thrown: " + e);
        }
        },
    lightOn: function(milliseconds) {
        deviceapis.deviceinteraction.lightOn(function() {
            console.log("Lighting for "+milliseconds+" second");
        },
        function() {
            console.log("Failed to light");
        },
        milliseconds);
    }
};
