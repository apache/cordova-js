// Define JavaScript plugin implementations that are common across
// WebWorks platforms (phone/tablet).
var plugins = {};

module.exports = {
    exec: function (win, fail, clazz, action, args) {
        if (plugins[clazz]) {
            return plugins[clazz].execute(action, args, win, fail);
        }

        return {"status" : PhoneGap.callbackStatus.CLASS_NOT_FOUND_EXCEPTION, "message" : "Class " + clazz + " cannot be found"};
    }
};
