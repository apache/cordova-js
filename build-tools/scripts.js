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

const path = require('path');
const {
    readContents,
    stripLicenseHeader,
    prependFileComment,
    values,
    pkgRoot,
    collectModules
} = require('./common');

module.exports = function scripts (config) {
    const scripts = values(collectScripts());
    return Promise.all(scripts.map(scriptPipeline(config)))
        .then(indexByModuleId);
};

function collectScripts () {
    const scripts = collectModules(path.join(pkgRoot, 'src/scripts'));
    for (const script of ['require', 'bootstrap']) {
        if (script in scripts) continue;
        throw new Error(`Could not find required script '${script}.js'`);
    }
    return scripts;
}

function scriptPipeline (config) {
    return f => Promise.resolve(f)
        .then(readContents)
        .then(config.preprocess)
        .then(stripLicenseHeader)
        .then(prependEmptyLine)
        .then(prependFileComment);
}

function prependEmptyLine (f) {
    return Object.assign({}, f, { contents: '\n' + f.contents });
}

function indexByModuleId (files) {
    return files
        .reduce((acc, f) => Object.assign(acc, { [f.moduleId]: f }), {});
}
