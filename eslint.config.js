/**
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
*/

const { defineConfig, globalIgnores } = require('eslint/config');
const browserConfig = require('@cordova/eslint-config/browser');
const browserTestConfig = require('@cordova/eslint-config/browser-tests');

module.exports = defineConfig([
    globalIgnores([
        '**/coverage/',
        '**/pkg/'
    ]),
    ...browserConfig.map(config => ({
        ...config,
        files: [
            'src/**/*.js',
            'test/test-platform-modules/**/*.js'
        ],
        languageOptions: {
            ...(config?.languageOptions || {}),
            globals: {
                ...(config.languageOptions?.globals || {}),
                PLATFORM_VERSION_BUILD_LABEL: false,
                define: false,
                module: false,
                require: false,
                exports: false
            },
        },
        plugins: {
            ...(config?.plugins || {}),
            es5: require('eslint-plugin-es5'),
        },
        rules: {
            ...(config.rules || {}),
            'no-var': 0,
            'object-shorthand': 0,
            // no-es2015
            'es5/no-arrow-functions': 2,
            'es5/no-binary-and-octal-literals': 2,
            'es5/no-block-scoping': 2,
            'es5/no-classes': 2,
            'es5/no-computed-properties': 2,
            'es5/no-default-parameters': 2,
            'es5/no-destructuring': 2,
            'es5/no-es6-methods': 2,
            'es5/no-es6-static-methods': 2,
            'es5/no-for-of': 2,
            'es5/no-generators': 2,
            'es5/no-modules': 2,
            'es5/no-object-super': 2,
            'es5/no-rest-parameters': 2,
            'es5/no-shorthand-properties': 2,
            'es5/no-spread': 2,
            'es5/no-template-literals': 2,
            'es5/no-typeof-symbol': 2,
            'es5/no-unicode-code-point-escape': 2,
            'es5/no-unicode-regex': 2,
            // no-es2016
            'es5/no-exponentiation-operator': 2
        }
    })),
    ...browserTestConfig.map(config => ({
        ...config,
        files: ['test/**/*.js'],
        languageOptions: {
            ...(config?.languageOptions || {}),
            globals: {
                ...(config.languageOptions?.globals || {}),
                cordova: false,
            }
        }
    }))
]);
