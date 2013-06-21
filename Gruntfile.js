/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
*/
module.exports = function(grunt) {
    var childProcess = require('child_process');
    var fs = require('fs');
    var path = require('path');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cordovajs: {
          "android": {},
          "bada": {},
          "blackberry": {},
          "blackberry10": {},
          "errgen": {},
          "firefoxos": {},
          "ios": {},
          "osx":  {},
          "test": {},
          "tizen": {},
          "webos":  {},
          "windows8": { useWindowsLineEndings: true },
          "windowsphone": { useWindowsLineEndings: true },
        },
        clean: ['pkg'],
        jshint: {
            options: {
                jshintrc: '.jshintrc',
            },
            src: [ 'lib/**/*.js' ]
        },
    });

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

    var cachedGitVersion = null;
    function computeGitVersion(callback) {
        if (cachedGitVersion) {
            callback(cachedGitVersion);
            return;
        }
        var gitPath = 'git';
        var args = 'describe --tags --long';
        childProcess.exec(gitPath + ' ' + args, function(err, stdout, stderr) {
            var isWindows = process.platform.slice(0, 3) == 'win';
            if (err && isWindows) {
                gitPath = '"' + path.join(process.env['ProgramFiles'], 'Git', 'bin', 'git.exe') + '"';
                childProcess.exec(gitPath + ' ' + args, function(err, stdout, stderr) {
                    if (err) {
                        error(err);
                    } else {
                        done(stdout);
                    }
                });
            } else if (err) {
                error(err);
            } else {
                done(stdout);
            }
        });

        function error(err) {
            throw new Error(err);
        }

        function done(stdout) {
            var version = stdout.trim().replace(/^2.5.0-.*?-/, 'dev-');
            cachedGitVersion = version;
            callback(version);
        };
    }

    function processWhiteSpace(processor, callback) {
        var rexp_minified = new RegExp("\\.min\\.js$");
        var rexp_src = new RegExp('\\.js$');
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
        }, callback);
    }

    grunt.registerMultiTask('cordovajs', 'Packages cordova.js', function() {
        var packager = require("./build/packager");
        var done = this.async();
        var platformName = this.target;
        var useWindowsLineEndings = this.data.useWindowsLineEndings;
        computeGitVersion(function(version) {
            grunt.log.writeln('Build label: ' + version);
            packager.generate(platformName, version, useWindowsLineEndings);
            done();
        });
    });

    grunt.registerTask('test', 'Runs test in node', function() {
        var done = this.async();
        require('./test/runner').node();
    });

    grunt.registerTask('btest', 'Runs tests in the browser', function() {
        require('./test/runner').browser();
        this.async(); // never finish.
    });

    grunt.registerTask('complainwhitespace', 'Complain about what fixwhitespace would fix', function() {
        var done = this.async();
        var complainedAboutWhitespace = false;
        processWhiteSpace(function(file, newSource) {
            if (!complainedAboutWhitespace) {
                grunt.log.writeln("files with whitespace issues: (to fix: `grunt fixwhitespace`)");
                complainedAboutWhitespace = true;
            }
            grunt.log.writeln("   " + file);
        }, done);
    });

    grunt.registerTask('fixwhitespace', 'Converts tabs to four spaces, eliminates trailing white space, converts newlines to proper form - enforcing style guide ftw!', function() {
        var done = this.async();
        var complainedAboutWhitespace = false;
        processWhiteSpace(function(file, newSource) {
            if (!complainedAboutWhitespace) {
                grunt.log.writeln("Fixed whitespace issues in:");
                complainedAboutWhitespace = true;
            }
            fs.writeFileSync(file, newSource, 'utf8');
            grunt.log.writeln("   " + file);
        }, done);
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    grunt.registerTask('default', ['cordovajs', 'complainwhitespace', 'test']);
};
