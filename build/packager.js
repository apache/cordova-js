var util = require('util'),
    debug = false,
    fs = require('fs');

// Recursively list contents of a directory
function walk(dir) {
  var results = [];
  var list = fs.readdirSync(dir);
  for (var i = 0, l = list.length; i < l; i++) {
    var file = list[i];
    file = dir + '/' + file;
    var stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
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
    var define_id = (typeof id != 'undefined' && id.length > 0 ? id : path.replace(/lib\//, "phonegap/").replace(/\.js$/, ''));
    return "define('" + define_id + "', function(require, exports, module) {\n" + file + "});\n";
  });
}

module.exports = {
    modules: function (platform) {
        var baseFiles = [
                "lib/utils.js",
                "lib/plugin/navigator.js",
                "lib/plugin/network.js",
                "lib/plugin/notification.js",
                "lib/plugin/accelerometer.js",
                "lib/plugin/Acceleration.js",
                "lib/plugin/CameraConstants.js",
                "lib/plugin/camera.js",
                "lib/plugin/Connection.js",
                "lib/builder.js"
            ],
            platformFiles = walk('lib/plugin/' + platform),
            output = "";

        //include phonegap
        output += drop('lib/phonegap.js', 'phonegap');

        //include exec
        output += drop('lib/exec/' + platform + '.js', 'phonegap/exec');

        //include common platform base
        output += drop('lib/platform/common.js', 'phonegap/common');

        //include platform
        output += drop('lib/platform/' + platform + '.js', 'phonegap/platform');

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

        //include require
        output += include("thirdparty/almond.js");
        output += "define.unordered = true;\n";

        // include channel - this one is needed early
        output += drop('lib/channel.js');

        // include the event listener hijacks (needs to happen early)
        output += include("lib/hijacks.js");

        //include modules
        output += this.modules(platform);

        // HACK: this gets done in bootstrap.js anyways, once native side is ready + domcontentloaded is fired. Do we need it?
        output += "window.PhoneGap = require('phonegap');\n"; 

        //include bootstrap
        output += include('lib/bootstrap.js');
        output += include('lib/bootstrap/' + platform + '.js');

        fs.writeFileSync(__dirname + "/../pkg/phonegap." + platform + ".js", output);
    }
};
