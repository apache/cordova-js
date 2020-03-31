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

const execa = require('execa');
const bundle = require('./bundle');
const scripts = require('./scripts');
const modules = require('./modules');
const { pkgRoot } = require('./common');

module.exports = function build (userConfig) {
    const config = Object.assign({ preprocess: x => x }, userConfig);

    return Promise.all([
        scripts(config),
        modules(config),
        getCommitId()
    ])
        .then(([scripts, modules, commitId]) => {
            Object.assign(config, { commitId });
            return bundle(scripts, modules, config);
        });
};

function getCommitId () {
    return execa('git', ['rev-parse', 'HEAD'], { cwd: pkgRoot }).then(data => data.stdout);
}
