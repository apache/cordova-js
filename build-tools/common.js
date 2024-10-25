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

const pkgRoot = path.join(__dirname, '..');

function glob (pattern, opts) {
    if (fs.globSync) {
        return fs.globSync(pattern, opts);
    } else {
        const fastGlob = require('fast-glob');
        return fastGlob.sync(pattern, opts);
    }
}

module.exports = {
    pkgRoot,

    values (obj) {
        return Object.keys(obj).map(key => obj[key]);
    },

    readContents (f) {
        return fs.promises.readFile(f.path, 'utf8')
            .then(contents => Object.assign({}, f, { contents }));
    },

    // Strips the license header.
    // Basically only the first multi-line comment up to to the closing */
    stripLicenseHeader (f) {
        const LICENSE_REGEX = /^\s*\/\*[\s\S]+?\*\/\s*/;
        const withoutLicense = f.contents.replace(LICENSE_REGEX, '');
        return Object.assign({}, f, { contents: withoutLicense });
    },

    // TODO format path relative to pkg.json
    prependFileComment (f) {
        const relativePath = path.relative(pkgRoot, f.path);
        const normalizedPath = path.posix.normalize(relativePath);
        const comment = `// file: ${normalizedPath}`;
        const contents = [comment, f.contents].join('\n');
        return Object.assign({}, f, { contents });
    },

    collectModules (dir) {
        return glob(['**/*.js'], { cwd: dir })
            .map(fileName => ({
                path: path.join(dir, fileName),
                // This is used as an identifier with URL-style (POSIX-style) path separators
                moduleId: fileName.replaceAll(path.sep, path.posix.sep).slice(0, -3)
            }))
            .map(file => ({ [file.moduleId]: file }))
            .reduce((result, fragment) => Object.assign(result, fragment), {});
    }
};
