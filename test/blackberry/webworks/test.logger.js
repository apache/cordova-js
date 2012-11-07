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

describe("logger", function () {
    var logger = require('cordova/plugin/webworks/logger');

    describe("log", function() {
        it("should post a console log", function() {            
            spyOn(console, "log");
            var l = logger.log("Yodalay-Yodalay-Yodalay-Hee-Hoo!");
            
            expect(console.log).toHaveBeenCalledWith("Yodalay-Yodalay-Yodalay-Hee-Hoo!");
        	expect(l.status).toBe(1);
        	expect(l.message).toBe('Message logged to console: Yodalay-Yodalay-Yodalay-Hee-Hoo!');
        });
    });

});
