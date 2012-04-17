var plugins = {
    "Device": require('bada/plugin/device'),
};
module.exports = {
    exec: function(success, fail, service, action, args) {
        try {
            plugins[service][action](success, fail, args);
        }
        catch(e) {
            console.log("missing exec: " + service + "." + action);
            console.log(args);
            console.log(e);
            console.log(e.stack);
        }
    }
}
