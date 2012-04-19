
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
        packager.generate("bada",commitId);
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

desc('check sources with JSHint');
task('hint', ['fixwhitespace'], function () {
    var knownWarnings = ["Redefinition of 'FileReader'", "Redefinition of 'require'", "Read only"];
    var filterKnownWarnings = function(el, index, array) {
        var wut = false;
        knownWarnings.forEach(function(e) {
            wut = wut && (el.indexOf(e) > -1);
        });
        return wut;
    };

    childProcess.exec("jshint lib",function(err,stdout,stderr) {
        var exs = stdout.split('\n');
        console.log(exs.filter(filterKnownWarnings).join('\n')); 
        complete();
    });
}, true);

desc('converts tabs to four spaces, eliminates trailing white space, converts newlines to proper form - enforcing style guide ftw!');
task('fixwhitespace', function() {
    forEachFile('lib', function(err, file, stats, cbDone) {
        //if (err) throw err;
        if (rexp_minified.test(file) || !rexp_src.test(file)) {
            cbDone();
        } else {
            var src = fs.readFileSync(file, 'utf8');

            // tabs -> four spaces
            if (src.indexOf('\t') >= 0) {
                src = src.split('\t').join('    ');
            }

            // convert carriage return + line feed to just a line feed
            src = src.replace(/\r\n/g, '\n');

            // eliminate trailing white space
            src = src.replace(/ +\n/g, '\n');

            // write it out yo
            fs.writeFileSync(file, src, 'utf8');
            cbDone();
        }
    }, complete);
}, true);
