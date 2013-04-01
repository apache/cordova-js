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

var channel = require('cordova/channel'),
    utils = require('cordova/utils');

function Device() {
    this.platform = null;
    this.version = null;
    this.name = null;
    this.uuid = null;
    this.cordova = null;

    var me = this;

    channel.onCordovaReady.subscribe(function() {
       me.getDeviceInfo(function (device) {
           me.platform = device.platform;
           me.version  = device.version;
           me.name     = device.name;
           me.uuid     = device.uuid;
           me.cordova  = device.cordova;

           channel.onCordovaInfoReady.fire();
       },
       function (e) {
           me.available = false;
           utils.alert("error initializing cordova: " + e);
       });
    });
}


Device.prototype.getDeviceInfo = function(success, fail, args) {
   var info = deviceapis.devicestatus;
   var properties = ["name", "uuid", "os_name", "os_vendor", "os_version"];

   var me = this;

   var name = null,
       platform = null,
       uuid = null,
       os_name = null,
       os_version = null,
       os_vendor = null;

   var checkProperties = function() {
       properties.pop();
       if(properties.length === 0) {
           me.name = name;
           me.platform = os_vendor + " " + os_name;
           me.version = os_version;
           me.uuid = uuid;
           me.cordova = "2.6.0";
           success(me);
       }
   };

   info.getPropertyValue(function(value) {
           //console.log("Device IMEI: "+value);
           uuid = value;
           checkProperties();
           }, fail, {aspect: "Device", property: "imei"});
   info.getPropertyValue(function(value) {
           //console.log("Device name: "+value);
           name = value;
           checkProperties();
           }, fail, {aspect: "Device", property: "version"});
   info.getPropertyValue(function(value) {
           //console.log("OperatingSystem name: "+value);
           os_name = value;
           checkProperties();
           }, fail, {aspect: "OperatingSystem", property: "name"});
   info.getPropertyValue(function(value) {
           //console.log("OperatingSystem version: "+value);
           os_version = value;
           checkProperties();
           }, fail, {aspect: "OperatingSystem", property: "version"});
   info.getPropertyValue(function(value) {
           //console.log("OperatingSystem vendor: "+value);
           os_vendor = value;
           checkProperties();
           }, fail, {aspect: "OperatingSystem", property: "vendor"});
};

module.exports = new Device();
