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

describe("media", function () {
    var media = require('cordova/plugin/webworks/media'),
    	exec = require('cordova/exec');
    
    describe("create", function() {

        it("should fail to create a media object", function() {            
            var m = media.create(8);

        	expect(m.status).toBe(9);
        	expect(m.message).toBe('Media Object id was not sent in arguments');
        });

        it("should create a media object", function() {            
     
        	var Audio = jasmine.createSpy('Audio');
        	window.Audio = new Audio;

        	// spyOn(window, "Audio");

         	// var m = media.create(["jammin", "yeah man!"]);

         	// expect(window.Audio).toHaveBeenCalled();
            
        	// expect(m.status).toBe(1);
        	// expect(m.message).toBe('Audio object created');
        });
    });


});
