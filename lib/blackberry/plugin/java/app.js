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

var exec = require('cordova/exec'),
    platform = require('cordova/platform'),
    manager = require('cordova/plugin/' + platform.runtime() + '/manager');

module.exports = {
  /**
   * Clear the resource cache.
   */
  clearCache:function() {
      if (typeof blackberry.widgetcache === "undefined" || blackberry.widgetcache === null) {
          console.log("blackberry.widgetcache permission not found. Cache clear request denied.");
          return;
      }
      blackberry.widgetcache.clearAll();
  },

  /**
   * Clear web history in this web view.
   * Instead of BACK button loading the previous web page, it will exit the app.
   */
  clearHistory:function() {
    exec(null, null, "App", "clearHistory", []);
  },

  /**
   * Go to previous page displayed.
   * This is the same as pressing the backbutton on Android device.
   */
  backHistory:function() {
    // window.history.back() behaves oddly on BlackBerry, so use
    // native implementation.
    exec(null, null, "App", "backHistory", []);
  },

  /**
   * Exit and terminate the application.
   */
  exitApp:function() {
      // Call onunload if it is defined since BlackBerry does not invoke
      // on application exit.
      if (typeof window.onunload === "function") {
          window.onunload();
      }

      // allow Cordova JavaScript Extension opportunity to cleanup
      manager.destroy();

      // exit the app
      blackberry.app.exit();
  }
};
