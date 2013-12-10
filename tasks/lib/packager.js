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
var fs              = require('fs');
var path            = require('path');
var bundle          = require('./bundle');
var computeCommitId = require('./compute-commit-id');
/*
var childProcess    = require('child_process');
var util            = require('util');
var stripHeader     = require('./strip-header');
var copyProps       = require('./copy-props');
var getModuleId     = require('./get-module-id');
var writeContents   = require('./write-contents');
var writeModule     = require('./write-module');
var writeScript     = require('./write-script');
var collectFiles    = require('./collect-files');
var collectFile     = require('./collect-file');
*/

module.exports = function generate(platform, useWindowsLineEndings, callback) {
    computeCommitId(function(commitId) {
        var outFile;
        var time = new Date().valueOf();

        var libraryRelease = bundle(platform, false, commitId);
        // if we are using windows line endings, we will also add the BOM
        if(useWindowsLineEndings) {
            libraryRelease = "\ufeff" + libraryRelease.split(/\r?\n/).join("\r\n");
        }
        var libraryDebug   = bundle(platform, true, commitId);
        
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
