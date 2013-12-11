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
var fs           = require('fs')
var childProcess = require('child_process');


module.exports = function computeCommitId(callback, cachedGitVersion) {

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
