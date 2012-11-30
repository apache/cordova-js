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

describe("blackberry qnx platform", function () {
    var platform = require('cordova/plugin/qnx/platform'),
        cordova = require('cordova');

    beforeEach(function () {

        global.blackberry = {
            event:{
                addEventListener: jasmine.createSpy('addEventListener')
            }
        }

        spyOn(cordova, "fireDocumentEvent");

        spyOn(document, "addEventListener").andCallFake(function(){
            blackberry.event.addEventListener("pause", function(){
                cordova.fireDocumentEvent("pause")
            });
            blackberry.event.addEventListener("resume", function(){
                cordova.fireDocumentEvent("resume")
            });

            window.addEventListener("online", function(){
                cordova.fireDocumentEvent("online");
            });
            window.addEventListener("offline", function(){
                cordova.fireDocumentEvent("offline");
            });
        });
        
        spyOn(window, "addEventListener").andCallFake(function(){
            cordova.fireDocumentEvent("online");
            cordova.fireDocumentEvent("offline");
        });
    });

    afterEach(function(){
        delete global.blackberry;
    });

    describe("exports", function(){
        it('should have the qnx id', function(){
            expect(platform.id).toBe("qnx");
        });
    });

    describe("initialize", function(){
        it('should add an event listener to document', function(){
            platform.initialize();
            expect(document.addEventListener).toHaveBeenCalledWith("deviceready", jasmine.any(Function));
        });
        it('should check if blackberry event addEventListener was called for pause', function(){
            platform.initialize();
            expect(blackberry.event.addEventListener).toHaveBeenCalledWith("pause", jasmine.any(Function));
        });
        it('should check if blackberry event addEventListener was called for resume', function(){
            platform.initialize();     
            expect(blackberry.event.addEventListener).toHaveBeenCalledWith("resume", jasmine.any(Function));
        });
        it('should check if window.addEventListener was called for online', function(){
            platform.initialize();
            expect(window.addEventListener).toHaveBeenCalledWith("online", jasmine.any(Function));
            
        });
        it('should check if window.addEventListener was called for offline', function(){
            platform.initialize();
            expect(window.addEventListener).toHaveBeenCalledWith("offline", jasmine.any(Function));
        });

        it('should call cordova.fireDocumentEvent online', function(){
            platform.initialize();
            expect(cordova.fireDocumentEvent).toHaveBeenCalledWith("online");
        });
        it('should call cordova.fireDocumentEvent offline', function(){
            platform.initialize();
            expect(cordova.fireDocumentEvent).toHaveBeenCalledWith("offline");
        });
        it('should call cordova.fireDocumentEvent pause', function(){
            delete global.blackberry;
            global.blackberry = { event: { addEventListener: function(){ } } };
            spyOn(blackberry.event, "addEventListener").andCallFake(function(){
                cordova.fireDocumentEvent("pause");
            });

            platform.initialize();
            
            expect(cordova.fireDocumentEvent).toHaveBeenCalledWith("pause");
        });
        it('should call cordova.fireDocumentEvent resume', function(){
            delete global.blackberry;
            global.blackberry = { event: { addEventListener: function(){ } } };
            spyOn(blackberry.event, "addEventListener").andCallFake(function(){
                cordova.fireDocumentEvent("resume");
            });

            platform.initialize();
            
            expect(cordova.fireDocumentEvent).toHaveBeenCalledWith("resume");
        });

    });

    describe('export objects', function(){
        it('should define the requestFileSystem path', function(){
            expect(platform.objects.requestFileSystem.path).toEqual("cordova/plugin/qnx/requestFileSystem");
        });

        it('should define the resolveLocalFileSystemURI path', function(){
            expect(platform.objects.resolveLocalFileSystemURI.path).toEqual("cordova/plugin/qnx/resolveLocalFileSystemURI");
        });
    });

    describe('export merges', function(){
        it('should define the compass path', function(){
            expect(platform.merges.navigator.children.compass.path).toEqual("cordova/plugin/qnx/compass");
        });
    });
    
});