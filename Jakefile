/*
 * Licensed to the Apache Software Foundation (ASF
 * or more contributor license agreements.  See th
 * distributed with this work for additional infor
 * regarding copyright ownership.  The ASF license
 * to you under the Apache License, Version 2.0 (t
 * "License"); you may not use this file except in
 * with the License.  You may obtain a copy of the
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to 
 * software distributed under the License is distr
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * KIND, either express or implied.  See the Licen
 * specific language governing permissions and lim
 * under the License.
 */

var util         = require('util'),
    fs           = require('fs'),
    childProcess = require('child_process'),
    path         = require("path"),
    rexp_minified = new RegExp("\\.min\\.js$"),
    rexp_src = new RegExp('\\.js$');

// HELPERS
// Iterates over a directory
function forEachFile(root, cbFile, cbDone) {
    var count = 0;

    function scan(name) {
        ++count;

        fs.stat(name, function (err, stats) {
            if (err) cbFile(err);

            if (stats.isDirectory()) {
                fs.readdir(name, function (err, files) {
                    if (err) cbFile(err);

                    files.forEach(function (file) {
                        scan(path.join(name, file));
                    });
                    done();
                });
            } else if (stats.isFile()) {
                cbFile(null, name, stats, done);
            } else {
                done();
            }
        });
    }

    function done() {
        --count;
        if (count === 0 && cbDone) cbDone();
    }

    scan(root);
}

function computeGitVersion(callback) {
    childProcess.exec('git describe --tags --long', function(err, stdout, stderr) {
        var version = stdout.trim().replace(/^2.5.0-.*?-/, 'dev-');
        callback(version);
    });
}

desc("runs build");
task('default', ['build','test'], function () {});

desc("clean");
task('clean', ['set-cwd'], function () {
    
    var DEPLOY = path.join(__dirname,"pkg");
    var cmd = 'rm -rf ' + DEPLOY + ' && ' +
              'mkdir ' + DEPLOY + ' && ' +
              'mkdir ' + path.join(DEPLOY ,'debug');

    childProcess.exec(cmd,complete);
}, true);

desc("compiles the source files for all extensions");
task('build', ['clean', 'hint', 'update-version'], function () {
    var packager = require("./build/packager");
    computeGitVersion(function(version) {
        console.log("building " + version);

        packager.generate("windows8", version,true);
        packager.generate("blackberry", version);
        packager.generate("firefoxos", version);
        packager.generate("ios", version);
        packager.generate("windowsphone", version,true);
        packager.generate("android", version);
        packager.generate("bada", version);
        packager.generate("tizen", version);
        packager.generate("webos",  version);
        packager.generate("osx",  version);
        packager.generate("errgen", version);
        packager.generate("test", version);
        complete();
    });
}, true);

desc("drops VERSION into JavaScript-based platforms");
task('update-version', ['set-cwd'], function() {
    var version = fs.readFileSync("VERSION", "utf-8").toString().split(/\r?\n/).join('');

    // List of files that need to be interpolated with matching regexes
    var files = {
        "lib/bada/plugin/bada/device.js":/(me\.cordova\s=\s").+(")/,
        "lib/tizen/plugin/tizen/Device.js":/(this\.cordova\s=\s").+(")/,
        "lib/firefoxos/plugin/firefoxos/device.js":/(this\.cordova\s=\s").+(")/,
        "lib/blackberry/plugin/qnx/device.js":/(cordova:\s").+(")/,
        "lib/blackberry/plugin/air/device.js":/(cordova:\s").+(")/,
        "lib/windows8/plugin/windows8/DeviceProxy.js":/(cordova:\s").+(")/
    };

    for (var f in files) if (files.hasOwnProperty(f)) {
        var interpolatedContent = fs.readFileSync(f, "utf-8").toString().replace(files[f], "$1" + version + "$2");
        fs.writeFileSync(f, interpolatedContent);
    }
});

desc("prints a dalek");
task('dalek', ['set-cwd'], function () {
    util.puts(fs.readFileSync("build/dalek", "utf-8"));
});

desc("runs the unit tests in node");
task('test', ['set-cwd'], require('./test/runner').node);

desc("starts a webserver to point at to run the unit tests");
task('btest', ['set-cwd'], require('./test/runner').browser);

desc("make sure we're in the right directory");
task('set-cwd', [], function() {
    if (__dirname != process.cwd()) {
        process.chdir(__dirname);
    }
});

desc('check sources with JSHint');
task('hint', ['complainwhitespace'], function () {
    var knownWarnings = [
        "Redefinition of 'FileReader'", 
        "Redefinition of 'require'", 
        "Read only",
        "Redefinition of 'console'"
    ];
    var filterKnownWarnings = function(el, index, array) {
        var wut = true;
        // filter out the known warnings listed out above
        knownWarnings.forEach(function(e) {
            wut = wut && (el.indexOf(e) == -1);
        });
        wut = wut && (!el.match(/\d+ errors/));
        return wut;
    };

    childProcess.exec("jshint lib",function(err,stdout,stderr) {
        var exs = stdout.split('\n');
        console.log(exs.filter(filterKnownWarnings).join('\n')); 
        complete();
    });
}, true);

var complainedAboutWhitespace = false

desc('complain about what fixwhitespace would fix');
task('complainwhitespace', function() {
    processWhiteSpace(function(file, newSource) {
        if (!complainedAboutWhitespace) {
            console.log("files with whitespace issues: (to fix: `jake fixwhitespace`)")
            complainedAboutWhitespace = true
        }
        
        console.log("   " + file)
    })
}, true);

desc('converts tabs to four spaces, eliminates trailing white space, converts newlines to proper form - enforcing style guide ftw!');
task('fixwhitespace', function() {
    processWhiteSpace(function(file, newSource) {
        if (!complainedAboutWhitespace) {
            console.log("fixed whitespace issues in:")
            complainedAboutWhitespace = true
        }
        
        fs.writeFileSync(file, newSource, 'utf8');
        console.log("   " + file)
    })
}, true);

function processWhiteSpace(processor) {
    forEachFile('lib', function(err, file, stats, cbDone) {
        //if (err) throw err;
        if (rexp_minified.test(file) || !rexp_src.test(file)) {
            cbDone();
        } else {
            var origsrc = src = fs.readFileSync(file, 'utf8');

            // tabs -> four spaces
            if (src.indexOf('\t') >= 0) {
                src = src.split('\t').join('    ');
            }

            // eliminate trailing white space
            src = src.replace(/ +\n/g, '\n');

            if (origsrc !== src) {
                // write it out yo
                processor(file, src);
            }
            cbDone();
        }
    }, complete);
}
