/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
// open "http://search.npmjs.org/#/grunt" ; sudo npm -g install grunt

var child_process = require("child_process")

//------------------------------------------------------------------------------
// list of source files to watch
//------------------------------------------------------------------------------
var sourceFiles = [
    "build/**/*.js", 
    "grunt.js",
    "Jakefile",
    "lib/**/*.js",
    "test/**/*.js"
]

//------------------------------------------------------------------------------
var gruntConfig = {
    watch: {
        jake: {
            files: sourceFiles,
            tasks: ["jake"]
        }
    }
}

//------------------------------------------------------------------------------
// run "jake"
//------------------------------------------------------------------------------
function jakeTask(grunt) {
    var done = this.async()
    var make = child_process.spawn('jake')
    
    make.stdout.on("data", function(data) {
        grunt.log.write("" + data)
    })
    
    make.stderr.on("data", function(data) {
        grunt.log.error("" + data)
    })
    
    make.on("exit", function(code) {
        if (code === 0) return done(true)
        
        grunt.log.writeln("error running jake", code)
        return done(false)
    })
}

//------------------------------------------------------------------------------
module.exports = function(grunt) {
    grunt.initConfig(gruntConfig)
    
    grunt.registerTask("default", "watch")
    grunt.registerTask("jake", "run jake", function(){jakeTask.call(this,grunt)}
    )
}
