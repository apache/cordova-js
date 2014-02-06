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
var bundle          = require('./bundle-browserify');
var computeCommitId = require('./compute-commit-id');


module.exports = function generate(platform, useWindowsLineEndings, callback) {
    computeCommitId(function(commitId) {
        var outFile, outFileStream;
        var time = new Date().valueOf();

        var libraryRelease = bundle(platform, false, commitId);
        // if we are using windows line endings, we will also add the BOM
       // if(useWindowsLineEndings) {
       //     libraryRelease = "\ufeff" + libraryRelease.split(/\r?\n/).join("\r\n");
       // }
        //var libraryDebug   = bundle(platform, true, commitId);

        time = new Date().valueOf() - time;
        if (!fs.existsSync('pkg')) {
            fs.mkdirSync('pkg');
        }
       // if(!fs.existsSync('pkg/debug')) {
       //     fs.mkdirSync('pkg/debug');
       // }
        //libraryRelease.bundle().pipe(process.stdout);

        outFile = path.join('pkg', 'cordova.' + platform + '.js');
        outFileStream = fs.createWriteStream(outFile);
        libraryRelease.bundle().pipe(outFileStream);

        libraryRelease.bundle().on('end', function() {
          console.log('generated cordova.' + platform + '.js @ ' + commitId + ' in ' + time + 'ms');
          callback();
        });

       // outFile = path.join('pkg', 'debug', 'cordova.' + platform + '-debug.js');
       // outFileStream = fs.createWriteStream(outFile);
       // libraryDebug.bundle().pipe(outFileStream);
    });
}
