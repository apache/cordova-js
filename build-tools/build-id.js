/*!
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

const fs = require('node:fs');
const path = require('node:path');
const child_process = require('node:child_process');
const { pkgRoot } = require('./common');

function getBuildId () {
    // Use git describe if in cordova-js repo, else use package version
    return fs.existsSync(path.join(pkgRoot, '.git'))
        ? describeGitRepo()
        : require('../package').version;
}

function describeGitRepo () {
    const gitArgs = ['describe', '--always', '--tags', '--match=rel/*', '--dirty'];
    return child_process.spawnSync('git', gitArgs, { cwd: pkgRoot }).stdout;
}

module.exports = getBuildId;
