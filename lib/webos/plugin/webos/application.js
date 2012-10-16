module.exports={

isActivated: function(inWindow) {
    inWindow = inWindow || window;
    if(inWindow.PalmSystem) {
        return inWindow.PalmSystem.isActivated
    }
    return false;
},

/*
 * Tell webOS to activate the current page of your app, bringing it into focus.
 * Example:
 *         navigator.application.activate();
 */
activate: function(inWindow) {
    inWindow = inWindow || window;
    if(inWindow.PalmSystem) {
        inWindow.PalmSystem.activate();
    }
},

/*
 * Tell webOS to deactivate your app.
 * Example:
 *        navigator.application.deactivate();
 */
deactivate: function(inWindow) {
    inWindow = inWindow || window;
    if(inWindow.PalmSystem) {
        inWindow.PalmSystem.deactivate();
    }
},

/*
 * Returns the identifier of the current running application (e.g. com.yourdomain.yourapp).
 * Example:
 *        navigator.application.getIdentifier();
 */
getIdentifier: function() {
    return PalmSystem.identifier;
},

fetchAppId: function() {
    if (window.PalmSystem) {
        // PalmSystem.identifier: <appid> <processid>
        return PalmSystem.identifier.split(" ")[0];
    }
}

}
