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
    	m;

    	beforeEach(function(){
    		global.Audio = function(src){ 
    			var funcs = {	
                    play: function(){}, 
    				pause: function(){},
    				currentTime: 800,
    				duration: 2100
    			}
    			return funcs;
    		}
    	});

    	afterEach(function(){
    		delete global.Audio;
    	});
    
    describe("create", function() {
        it("should fail to create a media object", function() {            
            m = media.create({});
        	expect(m.status).toBe(9);
        	expect(m.message).toBe('Media Object id was not sent in arguments');
        });

        it("should fail to create a media object", function() {            
            m = media.create(9);
        	expect(m.status).toBe(9);
        	expect(m.message).toBe('Media Object id was not sent in arguments');
        });

        it("should create a media object", function() {            
         	m = media.create(["jammin", "tunes/wejammin.mp3"]);
        	expect(m.status).toBe(1);
        	expect(m.message).toBe('Audio object created');
        });
    });

    describe("startPlayingAudio", function(){
    	it("should fail to find the media Object", function() {            
            m = media.startPlayingAudio({});
        	expect(m.status).toBe(9);
        	expect(m.message).toBe('Media Object id was not sent in arguments');
        });

        it("should fail to find media Source ", function() {          
            m = media.startPlayingAudio(["jammin"]);
        	expect(m.status).toBe(9);
        	expect(m.message).toBe('Media source argument not found');
        });
    	
    	it("should create a media object ", function() {
            m = media.startPlayingAudio(["jammin", "tunes/wejammin.mp3"]);
        	expect(m.status).toBe(1);
        	expect(m.message).toBe('Audio play started');
        });
    });

    describe("stopPlayingAudio", function(){
    	it("should fail to find the media Object", function() {            
            m = media.stopPlayingAudio(0);
        	expect(m.status).toBe(9);
        	expect(m.message).toBe('Media Object id was not sent in arguments');
        });

    	it("should stop the audio playback ", function() {
            m = media.stopPlayingAudio(["jammin", "tunes/wejammin.mp3"]);
        	expect(m.status).toBe(1);
        	expect(m.message).toBe('Audio play stopped');
        });

        it("should find that the Audio Object failed to initialze", function() {
            global.audio = undefined;
            m = media.stopPlayingAudio(["jammin"]);
        	expect(m.status).toBe(2);
        	expect(m.message).toBe('Audio Object has not been initialized');
        	delete global.audio;
        });
    });

    describe("seekToAudio", function(){
    	it("should fail to find the media Object", function() {            
            m = media.seekToAudio(0);
        	expect(m.status).toBe(9);
        	expect(m.message).toBe('Media Object id was not sent in arguments');
        });

        it("should find that the Audio Object failed to initialze", function() {
            global.audio = undefined;
            m = media.seekToAudio(["jammin"]);
        	expect(m.status).toBe(2);
        	expect(m.message).toBe('Audio Object has not been initialized');
        	delete global.audio;
        });

        it("should find that there is no time argument in the function", function() {
            media.create(["jammin", "tunes/wejammin.mp3"]);
            m = media.seekToAudio(["jammin"]);
        	expect(m.status).toBe(9);
        	expect(m.message).toBe('Media seek time argument not found');
        	media.release(["jammin"]);
        });

        // TODO: review error generators!!! It should have a listener to see when it changes and make calls based on those changes of that particular variable.
        // it("should result in an error seeking audio", function() {
        //     media.create(["jammin", "tunes/wejammin.mp3"]);
        //     m = media.seekToAudio(["jammin", 9000]);
        	
        // 	// expect(m.status).toBe(3);
        // 	expect(m.message).toBe('Seek to audio succeeded');
        	
        // 	media.release(["jammin"]);
        // });

        it("should successfully seek to audio", function() {
        	media.create(["jammin", "tunes/wejammin.mp3"]);
            m = media.seekToAudio(["jammin", 800]);
        	expect(m.status).toBe(1);
        	expect(m.message).toBe('Seek to audio succeeded');
        	media.release(["jammin"]);
        });

    	
    });

	describe("pausePlayingAudio", function(){
    	it("should fail to find the media Object", function() {            
            m = media.pausePlayingAudio(0);
        	expect(m.status).toBe(9);
        	expect(m.message).toBe('Media Object id was not sent in arguments');
        });

        it("should find that the Audio Object failed to initialze", function() {
            global.audio = undefined;
            m = media.pausePlayingAudio(["jammin"]);
        	expect(m.status).toBe(2);
        	expect(m.message).toBe('Audio Object has not been initialized');
        	delete global.audio;
        });

        it("should successfully pause the audio", function() {
            media.create(["jammin", "tunes/wejammin.mp3"]);
            m = media.pausePlayingAudio(["jammin"]);
        	expect(m.status).toBe(1);
        	expect(m.message).toBe('Audio paused');
        	media.release(["jammin"]);
        });
    	
    });

    describe("getCurrentPositionAudio", function(){
        it("should fail to find the media Object", function() {            
            m = media.getCurrentPositionAudio(0);
            expect(m.status).toBe(9);
            expect(m.message).toBe('Media Object id was not sent in arguments');
        });

        it("should find that the Audio Object failed to initialze", function() {
            global.audio = undefined;
            m = media.getCurrentPositionAudio(["jammin"]);
            expect(m.status).toBe(2);
            expect(m.message).toBe('Audio Object has not been initialized');
            delete global.audio;
        });

        it("should successfully pause the audio", function() {
            media.create(["jammin", "tunes/wejammin.mp3"]);
            m = media.getCurrentPositionAudio(["jammin"]);
            expect(m.status).toBe(1);
            expect(m.message).toBe(800);
            media.release(["jammin"]);
        });

    });

    describe("getDuration", function(){
        it("should fail to find the media Object", function() {            
            m = media.getDuration(0);
            expect(m.status).toBe(9);
            expect(m.message).toBe('Media Object id was not sent in arguments');
        });

        it("should find that the Audio Object failed to initialze", function() {
            global.audio = undefined;
            m = media.getDuration(["jammin"]);
            expect(m.status).toBe(2);
            expect(m.message).toBe('Audio Object has not been initialized');
            delete global.audio;
        });

        it("should successfully pause the audio", function() {
            media.create(["jammin", "tunes/wejammin.mp3"]);
            m = media.getDuration(["jammin"]);
            expect(m.status).toBe(1);
            expect(m.message).toBe(2100);
            media.release(["jammin"]);
        });
        
    });

    describe("startRecordingAudio", function(){
        it("should fail to find the media Object", function() {            
            m = media.startRecordingAudio(0);
            expect(m.status).toBe(9);
            expect(m.message).toBe('Media Object id was not sent in arguments');
        });

        it("should find that the Audio Object failed to initialze", function() {
            global.audio = undefined;
            m = media.startRecordingAudio(["jammin"]);
            expect(m.status).toBe(2);
            expect(m.message).toBe('Media start recording, insufficient arguments');
            delete global.audio;
        });

        it("should successfully pause the audio", function() {
            media.create(["jammin", "tunes/wejammin.mp3"]);
            m = media.startRecordingAudio(["jammin"]);
            expect(m.status).toBe(1);
            expect(m.message).toBe(2100);
            media.release(["jammin"]);
        });
        
    });

    // describe("getDuration", function(){
    //     it("should fail to find the media Object", function() {            
    //         m = media.getDuration(0);
    //         expect(m.status).toBe(9);
    //         expect(m.message).toBe('Media Object id was not sent in arguments');
    //     });

    //     it("should find that the Audio Object failed to initialze", function() {
    //         global.audio = undefined;
    //         m = media.getDuration(["jammin"]);
    //         expect(m.status).toBe(2);
    //         expect(m.message).toBe('Audio Object has not been initialized');
    //         delete global.audio;
    //     });

    //     it("should successfully pause the audio", function() {
    //         media.create(["jammin", "tunes/wejammin.mp3"]);
    //         m = media.getDuration(["jammin"]);
    //         expect(m.status).toBe(1);
    //         expect(m.message).toBe(2100);
    //         media.release(["jammin"]);
    //     });
        
    // });

});
