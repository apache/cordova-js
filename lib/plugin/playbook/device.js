/*
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 * 
 * Copyright (c) 2005-2010, Nitobi Software Inc.
 * Copyright (c) 2010-2011, IBM Corporation
 */

var me = {},
    channel = require('phonegap/channel');

PhoneGap.exec(
    function (device) {
        me.platform = device.platform;
        me.version  = device.version;
        me.name     = device.name;
        me.uuid     = device.uuid;
        me.phonegap = device.phonegap;

        channel.onPhoneGapInfoReady.fire();
    },
    function (e) {
        console.log("error initializing phonegap: " + e);
    },
    "Device",
    "getDeviceInfo",
    []
);

module.exports = me;
