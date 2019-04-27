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

module.exports = function modules (config) {
    const commonModules = collectCommonModules();
    const modules = values(Object.assign(commonModules, config.extraModules));
    modules.sort((a, b) => a.moduleId.localeCompare(b.moduleId));
    return Promise.all(modules.map(modulePipeline(config)));
};

function collectCommonModules () {
    const modules = collectModules(path.join(pkgRoot, 'src/common'));
    modules[''] = {
        moduleId: '',
        path: path.join(pkgRoot, 'src/cordova.js')
    };
    return modules;
}

function modulePipeline (config) {
    return f => Promise.resolve(f)
        .then(readContents)
        .then(config.preprocess)
        .then(stripLicenseHeader)
        .then(addModuleNamespace('cordova'))
        .then(wrapInModuleContext)
        .then(prependFileComment);
}

function addModuleNamespace (ns) {
    return m => {
        const moduleId = path.posix.join(ns, m.moduleId);
        return Object.assign({}, m, { moduleId });
    };
}

function wrapInModuleContext (f) {
    const contents = moduleTemplate({ id: f.moduleId, body: f.contents });
    return Object.assign({}, f, { contents });
}

const moduleTemplate = ({ id, body }) => `
define("${id}", function(require, exports, module) {

${body}
});
`.trimLeft();
