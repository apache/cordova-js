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
        audio = {
            play: jasmine.createSpy("play"), 
            pause: jasmine.createSpy("pause"),
            currentTime: 800,
            duration: 2100
        };

    beforeEach(function(){
        audio.play.reset();
        audio.pause.reset();
        global.blackberry = {
            media:{
                microphone:{
                    record: jasmine.createSpy("blackberry.media.microphone.record")
                }
            }
        };

        global.Audio = jasmine.createSpy("Audio").andCallFake(function () {
            return audio;
        });
    });

    afterEach(function(){
        delete global.Audio;
        delete global.blackberry;
    });

    function handlesNoArgs(func) {
        it("should return an error message when no args provided", function() {            
            expect(func({})).toEqual({
                status: 9,
                message: 'Media Object id was not sent in arguments'
            });
        });
    }

    function handlesNotFound(func) {
        it("returns error if it can't find audio object", function () {
            expect(func(["FreeBird"])).toEqual({
                status: 2,
                message: 'Audio Object has not been initialized'
            });
        });
    }
    
    describe("create", function() {

        handlesNoArgs(media.create);

        it("should create an audio object for the src", function () {
            media.create(["jammin", "tunes/wejammin.mp3"]);
            expect(Audio).toHaveBeenCalledWith("tunes/wejammin.mp3");
        });

        it("returns success", function() {            
            expect(media.create(["jammin", "tunes/wejammin.mp3"])).toEqual({
                status: 1,
                message: 'Audio object created'
            });
        });
    });

    describe("startPlayingAudio", function(){

        handlesNoArgs(media.startPlayingAudio);

        it("errors out when no src", function () {
            expect(media.startPlayingAudio([1])).toEqual({
                status: 9,
                message: "Media source argument not found"
            });
        });

        it("returns success", function() {            
            expect(media.startPlayingAudio(["jammin", "tunes/wejammin.mp3"])).toEqual({
                status: 1,
                message: 'Audio play started'
            });
        });

        it("creates an audio object for the src", function () {
            media.startPlayingAudio(["push", "pushit.mp3"]);
            expect(Audio).toHaveBeenCalledWith("pushit.mp3");
        });

        it("calls play on the audio object", function () {
            media.startPlayingAudio(["baby", "babybabybabyohhh.mp3"]);
            expect(audio.play).toHaveBeenCalled();
        });

        it("calls pause if the audio id already existed", function () {
            media.startPlayingAudio(["ice", "iceicebaby.mp3"]);
            media.startPlayingAudio(["ice", "iceicebaby.mp3"]);
            expect(audio.pause).toHaveBeenCalled();
        });

        it("doesn't call pause on new id's", function () {
            media.startPlayingAudio(["loser", "loser.mp3"]);
            expect(audio.pause).not.toHaveBeenCalled();
        });
    });

    describe("stopPlayingAudio", function(){
        handlesNoArgs(media.stopPlayingAudio);
   
        it("finds that no Audio Object exists", function () {
            expect(media.stopPlayingAudio(["Free Bird"])).toEqual({
                status: 2,
                message: 'Audio Object has not been initialized'   
            });
        });

        describe("when it can find the audio object", function () {
            beforeEach(function () {
                media.startPlayingAudio(["thriller", "triller.mp3"]);
                audio.pause.reset(); //since start will call play
            });

            it("returns success", function () {
                expect(media.stopPlayingAudio(["thriller"])).toEqual({
                    status: 1,
                    message: "Audio play stopped"
                });
            });

            it("calls pause on the found audio object", function () {
                media.stopPlayingAudio(["thriller"]);
                expect(audio.pause).toHaveBeenCalled();
                
            });
        });
    });

    describe("seekToAudio", function(){
        handlesNoArgs(media.seekToAudio);
        handlesNotFound(media.seekToAudio);

        describe("when it can find an audio object", function () {
            beforeEach(function () {
                media.create(["yellowSubmarine", "yellowSubmarine.ogg"]);
            });

            it("returns a message when no seek time provided", function () {
                expect(media.seekToAudio(["yellowSubmarine"])).toEqual({
                    status: 9,
                    message: 'Media seek time argument not found'   
                });
            });

            it("sets the currentTime of the audio object", function () {
                media.seekToAudio(["yellowSubmarine", 12]);
                expect(audio.currentTime).toBe(12);
            });

            describe("when setting the current time fails", function () {
                beforeEach(function () {
                    spyOn(console, "log");
                    audio.__defineSetter__("currentTime", jasmine.createSpy("audio.currentTime").andThrow("holy balls!"));
                });

                afterEach(function () {
                    delete audio.currentTime;
                    audio.currentTime = 800;
                });

                it("logs the error", function () {
                    media.seekToAudio(["yellowSubmarine", 33]);
                    expect(console.log).toHaveBeenCalledWith("Error seeking audio: holy balls!");
                });

                it("returns the error", function () {
                    expect(media.seekToAudio(["yellowSubmarine", 33])).toEqual({
                        status: 3,
                        message: "Error seeking audio: holy balls!"
                    });
                });
            });
        });
    });

    describe("pausePlayingAudio", function(){
        handlesNoArgs(media.pausePlayingAudio); 
        handlesNotFound(media.pausePlayingAudio); 

        it("should pause the existing audio", function () {
            media.create(["WhatIsLove", "babyDontHurtMe.mp3"]);
            media.pausePlayingAudio(["WhatIsLove"]);
            expect(audio.pause).toHaveBeenCalled();
        });
        
        it("should return Audio paused", function () {
           media.create(["TheBoysAreBackInTown", "thinLizzyBaby.mp3"]);
           expect(media.pausePlayingAudio(["TheBoysAreBackInTown"])).toEqual({
                status: 1,
                message: 'Audio paused'     
           });
        });
    });

    describe("getCurrentPositionAudio", function(){
        handlesNoArgs(media.getCurrentPositionAudio);
        handlesNotFound(media.getCurrentPositionAudio);
        
        it("should return current audio position", function () {
            media.create(["InTheEnd", "linkinPark/inTheEnd.mp3"]);
            expect(media.getCurrentPositionAudio(["InTheEnd"])).toEqual({
                status: 1,
                message: 800
            });
        });
    });

    describe("getDuration", function(){
        handlesNoArgs(media.getDuration);
        handlesNotFound(media.getDuration);

        it("should return errors", function () {
            expect(media.getDuration(["EndlessLove"])).toEqual({
                status: 2,
                message:'Audio Object has not been initialized'
            });
        });    
    });

    xdescribe("startRecordingAudio", function(){
        handlesNoArgs(media.startRecordingAudio);
        handlesNotFound(media.startRecordingAudio);

        xit("should successfully pause the audio", function() {
            media.create(["jammin", "tunes/wejammin.mp3"]);
            m = media.startRecordingAudio(["jammin"]);
            expect(m.status).toBe(0);
            expect(m.message).toBe('WebWorks Is On It');
            media.release(["jammin"]);
        });
        
    });
});
