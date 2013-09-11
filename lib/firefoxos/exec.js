var firefoxos = require('cordova/platform');

module.exports = function(success, fail, service, action, actionArgs) {
    var plugin = firefoxos.getPlugin(service);
    actionArgs.unshift(fail);
    actionArgs.unshift(success);
    plugin[action].apply(plugin, actionArgs);
};
