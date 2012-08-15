var cordova = require('cordova'),
    connection = require('cordova/plugin/Connection');

module.exports = {
    getConnectionInfo: function (args, win, fail) {
        var connectionType = connection.NONE,
            eventType = "offline",
            callbackID,
            request;

        /**
         * For PlayBooks, we currently only have WiFi connections, so
         * return WiFi if there is any access at all.
         * TODO: update if/when PlayBook gets other connection types...
         */
        if (blackberry.system.hasDataCoverage()) {
            connectionType = connection.WIFI;
            eventType = "online";
        }

        //Register an event handler for the networkChange event
        callbackID = blackberry.events.registerEventHandler("networkChange", function (status) {
            win(status.type);
        });

        //pass our callback id down to our network extension
        request = new blackberry.transport.RemoteFunctionCall("org/apache/cordova/getConnectionInfo");
        request.addParam("networkStatusChangedID", callbackID);
        request.makeSyncCall();

        return { "status": cordova.callbackStatus.OK, "message": connectionType};
    }
};
