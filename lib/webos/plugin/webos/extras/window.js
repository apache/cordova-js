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

module.exports={
    launchParams: function() {
        return JSON.parse(PalmSystem.launchParams) || {};
    },
    
    isActivated: function(inWindow) {
        inWindow = inWindow || window;
        if(inWindow.PalmSystem) {
            return inWindow.PalmSystem.isActivated;
        }
        return false;
    },
    
    /*
     * Tell webOS to activate the current page of your app, bringing it into focus.
     * Example:
     *         navigator.application.activate();
     */
    activate: function(inWindow) {
        inWindow = inWindow || window;
        if(inWindow.PalmSystem) {
            inWindow.PalmSystem.activate();
        }
    },
    
    /*
     * Tell webOS to deactivate your app.
     * Example:
     *        navigator.application.deactivate();
     */
    deactivate: function(inWindow) {
        inWindow = inWindow || window;
        if(inWindow.PalmSystem) {
            inWindow.PalmSystem.deactivate();
        }
    },
    
    /*
     * This is a thin wrapper for 'window.open()' which optionally sets document contents to 'html', and calls 'PalmSystem.stageReady()'
     * on your new card. Note that this new card will not come with your framework (if any) or anything for that matter.
     * @param {String} url
     * @param {String} html
     * Example:
     *        navigator.window.newCard('about:blank', '<html><body>Hello again!</body></html>');
     */
    newCard: function(url, html) {
        var win = window.open(url || "");
        if (html)
            win.document.write(html);
        win.PalmSystem.stageReady();
    },

    /*
     * Enable or disable full screen display (full screen removes the app menu bar and the rounded corners of the screen).
     * @param {Boolean} state
     * Example:
     *        navigator.window.setFullScreen(true);
     */
    setFullScreen: function(state) {
        // valid state values are: true or false
        PalmSystem.enableFullScreenMode(state);
    },

    /*
     * used to set the window properties of the WebOS app
     * @param {Object} props
     * Example:
     *         private method used by other member functions - ideally we shouldn't call this method
     */
    setWindowProperties: function(inWindow, inProps) {
        if(arguments.length==1) {
            inProps = inWindow;
            inWindow = window;
        }
        if(inWindow.PalmSystem) {
            inWindow.PalmSystem.setWindowProperties(inProps);
        }
    },

    /*
     * Enable or disable screen timeout. When enabled, the device screen will not dim. This is useful for navigation, clocks or other "dock" apps.
     * @param {Boolean} state
     * Example:
     *        navigator.window.blockScreenTimeout(true);
     */
    blockScreenTimeout: function(state) {
        navigator.windowProperties.blockScreenTimeout = state;
        this.setWindowProperties(navigator.windowProperties);
    },

    /*
     * Sets the lightbar to be a little dimmer for screen locked notifications.
     * @param {Boolean} state
     * Example:
     *        navigator.window.setSubtleLightbar(true);
     */
    setSubtleLightbar: function(state) {
        navigator.windowProperties.setSubtleLightbar = state;
        this.setWindowProperties(navigator.windowProperties);
    }
};
