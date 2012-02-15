var util = require('util'),
    debug = false,
    fs = require('fs');

// (Recursively) list contents of a directory
function walk(dir, doRecursive) {
    var results = [];
    try {
        var list = fs.readdirSync(dir);
        for (var i = 0, l = list.length; i < l; i++) {
            var file = list[i];
            file = dir + '/' + file;
            var stat = fs.statSync(file);
            if (stat && doRecursive && stat.isDirectory()) {
                results = results.concat(walk(file,doRecursive));
            } else {
                results.push(file);
            }
        }
    } catch (e) {
        //do nothing
    }
    return results;
}
function include(files, transform) {
    files = files.map ? files : [files];
    return files.map(function (file) {
        try {
            var str = fs.readFileSync(file, "utf-8") + "\n";
            str = transform ? transform(str, file) : str;
            str = debug ? "try {" + str + "} catch (e) { alert('" + file + ":' + e);}" : str;
            return str;
        } catch (e) {
            //do nothing
        }
    }).join('\n');
}
function drop(files, id) {
    return include(files, function(file, path) {
        var define_id = (typeof id != 'undefined' && id.length > 0 ? id : path.replace(/lib\//, "cordova/").replace(/\.js$/, ''));
        return "define('" + define_id + "', function(require, exports, module) {\n" + file + "});\n";
    });
}

module.exports = {
    modules: function (platform) {
        var baseFiles = [
                "lib/utils.js",
                "lib/builder.js"
            ],
            platformFiles = walk('lib/plugin/' + platform, true),
            output = "";

        //HACK: ummm .... we really need to figure out this webworks common file stuff
        if (platform === "blackberry" || platform === "playbook") {
            platformFiles = platformFiles.concat(walk('lib/plugin/webworks', true));
        }

        //include all common platform files that are under lib/plugin
        baseFiles = baseFiles.concat(walk('lib/plugin'));

        //include require
        output += include("lib/require.js");

        //include channel
        output += drop('lib/channel.js', 'cordova/channel');

        //include phonegap
        output += drop('lib/cordova.js', 'cordova');

        //include exec
        output += drop('lib/exec/' + platform + '.js', 'cordova/exec');

        //include common platform defn 
        output += drop('lib/platform/common.js', 'cordova/common');

        //include platform defn
        output += drop('lib/platform/' + platform + '.js', 'cordova/platform');

        //include common modules
        output += drop(baseFiles);

        //include platform specific modules
        output += drop(platformFiles);

        return output;
    },

    bundle: function (platform) {
        var output = "";

        //include LICENSE
        output += include("LICENSE", function (file) {
            return "/*\n" + file + "\n*/\n";
        });

        //include modules
        output += this.modules(platform);

        // HACK: this gets done in bootstrap.js anyways, once native side is ready + domcontentloaded is fired. Do we need it?
        output += "window.cordova = require('cordova');\n"; 

        //include bootstrap
        output += include('lib/bootstrap.js');
        // TODO: we don't need platform-specific bootstrap.
        // those can go into the init function inside the platform/*.js
        // files
        output += include('lib/bootstrap/' + platform + '.js');

        fs.writeFileSync(__dirname + "/../pkg/cordova." + platform + ".js", output);
    }
};
