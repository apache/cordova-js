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

const path = require('node:path');
const bundle = require('./bundle');
const scripts = require('./scripts');
const modules = require('./modules');
const getBuildId = require('./build-id');
const { collectModules } = require('./common');

module.exports = function build (userConfig) {
    const defaults = { preprocess: x => x };

    // Infer some defaults from platform package root if present
    const { platformRoot } = userConfig;
    if (platformRoot) {
        const pkg = require(path.join(platformRoot, 'package'));
        Object.assign(defaults, {
            platformName: pkg.name,
            platformVersion: pkg.version,
            modulePath: path.join(platformRoot, 'cordova-js-src')
        });
    }

    const config = { ...defaults, ...userConfig };

    // Populate extraModules property if missing
    const { extraModules, modulePath } = config;
    config.extraModules = extraModules || collectModules(modulePath);

    // Throw error on misconfigured modulePath
    if (modulePath && Object.keys(config.extraModules).length === 0) {
        throw new Error(`Could not find any modules in ${modulePath}`);
    }

    // Delete convenience config keys that are not used after this point
    delete config.platformRoot;
    delete config.modulePath;

    return Promise.all([
        scripts(config),
        modules(config),
        getBuildId()
    ])
        .then(([scripts, modules, buildId]) => {
            Object.assign(config, { buildId });
            return bundle(scripts, modules, config);
        });
};
