/*
 *
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
 *
*/



if(!console || !console.log)
{
    var exec = require('cordova/exec'),
        channel = require('cordova/channel');



    var debugConsole = {
        log:function(msg){
        exec(null,null,"DebugConsole","log",msg);
        },
        warn:function(msg){
            exec(null,null,"DebugConsole","warn",msg);
        },
        error:function(msg){
            exec(null,null,"DebugConsole","error",msg);
        }
    };


    module.exports = debugConsole;
}
else
{

    if(console && console.log)
    {
        console.log("console.log exists already!");
        console.warn = console.warn || function(msg){console.log("warn:"+msg);};
        console.error = console.error || function(msg){console.log("error:"+msg);};

    }
}

