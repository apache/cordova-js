var DEPLOY = __dirname + "/pkg/";

desc("runs build");
task('default', ['build'], function () {});

desc("clean");
task('clean', [], function () {
    var childProcess = require('child_process');

    var cmd = 'rm -rf ' + DEPLOY + ' && ' +
              'mkdir ' + DEPLOY;

    childProcess.exec(cmd, function () {
        // For some reason we need to do this on windowsto build. 
        // Watch out, we are in bat country
        complete();
    });
}, true);

desc("compiles the source files for all extensions");
task('build', ['clean'], function () {

    var util = require('util'),
        fs = require('fs'),
        packager = require("./build/packager");

    packager.bundle("blackberry");
    packager.bundle("playbook");
    packager.bundle("ios");
    packager.bundle("wp7");
    packager.bundle("android");

    util.puts(fs.readFileSync("build/dalek", "utf-8"));
});

desc("starts a webserver to point at to run the unit tests");
task('test', [], require('./test/runner'));
