/*
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
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compile: {
            'android': {},
            'ios': {},
            'osx': {},
            'test': {},
            'windows': { useWindowsLineEndings: true },
            'browser': {},
            'electron': {}
        },
        clean: ['pkg']
    });

    // external tasks
    grunt.loadNpmTasks('grunt-contrib-clean');

    // custom tasks
    grunt.loadTasks('tasks');

    // defaults
    grunt.registerTask('default', ['compile']);
};
