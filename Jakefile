
var util         = require('util'),
    fs           = require('fs'),
    childProcess = require('child_process'),
    path         = require("path"),
    hint         = require('jshint'),
    rexp_minified = new RegExp("\\.min\\.js$"),
    rexp_src = new RegExp('\\.js$');


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

desc("runs build");
task('default', ['build','test'], function () {});

desc("clean");
task('clean', ['set-cwd'], function () {
    
    var DEPLOY = path.join(__dirname,"pkg");
    var cmd = 'rm -rf ' + DEPLOY + ' && ' +
              'mkdir ' + DEPLOY;

    childProcess.exec(cmd,complete);
}, true);

desc("compiles the source files for all extensions");
task('build', ['clean'], function () {
    var packager = require("./build/packager");
    var commitId = "";
    childProcess.exec("git log -1",function(err,stdout,stderr) {
        var stdoutLines = stdout.split("\n");
        if(stdoutLines.length > 0) {
            commitId = stdoutLines[0];
        }
        
        console.log("commit = " + commitId);
        packager.generate("blackberry",commitId);
        packager.generate("playbook",commitId);
        packager.generate("ios",commitId);
        packager.generate("wp7",commitId);
        packager.generate("android",commitId);
        packager.generate("errgen",commitId);
        packager.generate("test",commitId);
        complete();
    });
}, true);

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

// Taken shamelessly from Jakefile from https://github.com/marcenuc/sammy
desc('Check sources with JSHint.');
task('hint', function () {
    var JSHINT = require('jshint').JSHINT;

    function checkFile(file, cbDone) {
        fs.readFile(file, 'utf8', function (err, src) {
            if (err) throw err;

            var res = [],
                line;

            if (!JSHINT(src)) {
                res.push("\n" + file);
                JSHINT.errors.forEach(function (e) {
                    if (e) {
                        if (line !== e.line) {
                            line = e.line;
                            res.push(line + ": " + e.evidence);
                        }
                        res.push("\t" + e.reason);
                    }
                });
                console.log(res.join('\n'));
            }

            cbDone();
        });
    }

    forEachFile('lib', function (err, file, stats, cbDone) {
        if (err) throw err;

        if (rexp_minified.test(file) || !rexp_src.test(file)) {
            cbDone();
        } else {
            checkFile(file, cbDone);
        }
    }, function() {
        checkFile('Jakefile', complete);
    });
}, true);
