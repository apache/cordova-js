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

var childProcess  = require('child_process');
var fs            = require('fs');
var util          = require('util');
var path          = require('path');
var stripHeader   = require('./strip-header');
var copyProps     = require('./copy-props');
var getModuleId   = require('./get-module-id');
var writeContents = require('./write-contents');
var writeModule   = require('./write-module');
var writeScript   = require('./write-script');
var collectFiles  = require('./collect-files');
var collectFile   = require('./collect-file');





var packager = module.exports
var cachedGitVersion = null;

packager.computeCommitId = function(callback) {

    if (cachedGitVersion) {
        callback(cachedGitVersion);
        return;
    }

    var versionFileId = fs.readFileSync('VERSION', { encoding: 'utf8' }).trim();
    
    if (/-dev$/.test(versionFileId) && fs.existsSync('.git')) {
        var gitPath = 'git';
        var args = 'rev-list HEAD --max-count=1 --abbrev-commit';
        childProcess.exec(gitPath + ' ' + args, function(err, stdout, stderr) {
            var isWindows = process.platform.slice(0, 3) == 'win';
            if (err && isWindows) {
                gitPath = '"' + path.join(process.env['ProgramFiles'], 'Git', 'bin', 'git.exe') + '"';
                childProcess.exec(gitPath + ' ' + args, function(err, stdout, stderr) {
                    if (err) {
                        error(err);
                    } else {
                        done(versionFileId + '-' + stdout);
                    }
                });
            } else if (err) {
                error(err);
            } else {
                done(versionFileId + '-' + stdout);
            }
        });
    } else {
        done(fs.readFileSync('VERSION', { encoding: 'utf8' }));
    }

    function error(err) {
        throw new Error(err);
    }

    function done(stdout) {
        var version = stdout.trim();
        cachedGitVersion = version;
        callback(version);
    };
}

//------------------------------------------------------------------------------
packager.generate = function(platform, useWindowsLineEndings, callback) {
    packager.computeCommitId(function(commitId) {
        var outFile;
        var time = new Date().valueOf();

        var libraryRelease = packager.bundle(platform, false, commitId);
        // if we are using windows line endings, we will also add the BOM
        if(useWindowsLineEndings) {
            libraryRelease = "\ufeff" + libraryRelease.split(/\r?\n/).join("\r\n");
        }
        var libraryDebug   = packager.bundle(platform, true, commitId);
        
        time = new Date().valueOf() - time;
        if (!fs.existsSync('pkg')) {
            fs.mkdirSync('pkg');
        }
        if(!fs.existsSync('pkg/debug')) {
            fs.mkdirSync('pkg/debug');
        }

        outFile = path.join('pkg', 'cordova.' + platform + '.js');
        fs.writeFileSync(outFile, libraryRelease, 'utf8');
        
        outFile = path.join('pkg', 'debug', 'cordova.' + platform + '-debug.js');
        fs.writeFileSync(outFile, libraryDebug, 'utf8');
        
        console.log('generated cordova.' + platform + '.js @ ' + commitId + ' in ' + time + 'ms');
        callback();
    });
}

//------------------------------------------------------------------------------
packager.bundle = function(platform, debug, commitId) {
    var modules = collectFiles('lib/common')
    var scripts = collectFiles('lib/scripts')
    
    modules[''] = 'lib/cordova.js'
    copyProps(modules, collectFiles(path.join('lib', platform)));

    if (platform === 'test') {
        copyProps(modules, collectFiles(path.join('lib', 'android', 'android'), 'android/'));
    }

    var output = [];
	
    output.push("// Platform: " + platform);
    output.push("// "  + commitId);

    // write header
    output.push('/*', fs.readFileSync('LICENSE-for-js-file.txt', 'utf8'), '*/')
    output.push(';(function() {')
    output.push("var CORDOVA_JS_BUILD_LABEL = '"  + commitId + "';");

    // write initial scripts
    if (!scripts['require']) {
        throw new Error("didn't find a script for 'require'")
    }
    
    writeScript(output, scripts['require'], debug)

    // write modules
    var moduleIds = Object.keys(modules)
    moduleIds.sort()
    
    for (var i=0; i<moduleIds.length; i++) {
        var moduleId = moduleIds[i]
        
        writeModule(output, modules[moduleId], moduleId, debug)
    }

    output.push("window.cordova = require('cordova');")

    // write final scripts
    if (!scripts['bootstrap']) {
        throw new Error("didn't find a script for 'bootstrap'")
    }
    
    writeScript(output, scripts['bootstrap'], debug)
    
    var bootstrapPlatform = 'bootstrap-' + platform
    if (scripts[bootstrapPlatform]) {
        writeScript(output, scripts[bootstrapPlatform], debug)
    }

    // write trailer
    output.push('})();')

    return output.join('\n')
}

//------------------------------------------------------------------------------





