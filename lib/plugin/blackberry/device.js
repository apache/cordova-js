
/*
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 * 
 * Copyright (c) 2005-2010, Nitobi Software Inc.
 * Copyright (c) 2010-2011, IBM Corporation
 */

//HACK!!!
phonegap.device = phonegap.device || {};

var device = navigator.device || {},
    props = {
        platform: phonegap.device.platform,
        version:  blackberry.system.softwareVersion,
        name:     blackberry.system.model,
        uuid:     phonegap.device.uuid,
        phonegap: phonegap.device.phonegap
    },
    channel = require('phonegap/channel'),
    key;

for (key in props) {
    device[key] = props[key];
}

channel.onPhoneGapInfoReady.fire();
module.exports = device;
