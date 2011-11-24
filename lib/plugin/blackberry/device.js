
/*
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 * 
 * Copyright (c) 2005-2010, Nitobi Software Inc.
 * Copyright (c) 2010-2011, IBM Corporation
 */

/**
 * navigator.device
 * 
 * Represents the mobile device, and provides properties for inspecting the
 * model, version, UUID of the phone, etc.
 */
/**
 * @constructor
 */
function Device() {
    this.platform = phonegap.device.platform;
    this.version  = blackberry.system.softwareVersion;
    this.name     = blackberry.system.model;
    this.uuid     = phonegap.device.uuid;
    this.phonegap = phonegap.device.phonegap;
};


//HACK: this shouldn't be here, but gets me working in ripple for the moment

if (!window.phonegap) {
    window.phonegap = {
        device: {
            platform: "phonegap",
            uuid: "42",
            phonegap: "2.0"
        }
    };

    window.blackberry = {
        system: {
            softwareVersion: "1",
            model: "fake"
        }
    }
}

var device = navigator.device || {},
    props = {
        platform: phonegap.device.platform,
        version:  blackberry.system.softwareVersion,
        name:     blackberry.system.model,
        uuid:     phonegap.device.uuid,
        phonegap: phonegap.device.phonegap
    },
    Channel = require('phonegap/Channel'),
    key;

for (key in props) {
    device[key] = props[key];
} 

Channel.onPhoneGapInfoReady.fire();
module.exports = device;

