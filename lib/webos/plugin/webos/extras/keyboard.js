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

var state = {}

//Mojo LunaSysMgr hook for detecting keyboard shown
Mojo = window.Mojo || {};
Mojo.keyboardShown = function(inKeyboardShowing) {
    state.isShowing = inKeyboardShowing;
};

/*
 * webOS.keyboard.* namespace
 */
module.exports = {
    /**
     * Virtual keyboard type constants
     */
    types: {
        text: 0,
        password: 1,
        search: 2,
        range: 3,
        email: 4,
        number: 5,
        phone: 6,
        url: 7,
        color: 8
    },

    /**
     * Returns whether or not the virtual keyboard is currently displayed
     *
     * @return Boolean                      Virtual keyboard visibility.
     */
    isShowing: function() {
        return state.isShowing || false;
    },

    /**
     * Shows the virtual keyboard
     *
     * @param {Number} type                 Type of virtual keyboard to display; from webOS.keyboard.types constants. (OPTIONAL)
     */
    show: function(type){
        if(this.isManualMode() && window.PalmSystem) {
            PalmSystem.keyboardShow(type || 0);
        }
    },

    /**
     * Hides the virtual keyboard
     */
    hide: function(){
        if(this.isManualMode() && window.PalmSystem) {
            PalmSystem.keyboardHide();
        }
    },

    /**
     * Enables/disables manual mode for the virtual keyboard
     *
     * @param {Boolean} mode                 If true, keyboard must be manually forced shown/hidden. If false, it's automatic.
     */
    setManualMode: function(mode){
        state.manual = mode;
        if(window.PalmSystem) {
            PalmSystem.setManualKeyboardEnabled(mode);
        }
    },

    /**
     * Whether or not manual mode is set for the virtual keyboard
     *
     * @return Boolean                      Manual mode status
     */
    isManualMode: function(){
        return state.manual || false;
    },

    /**
     * Force the virtual keyboard to show. In the process, enables manual mode.
     *
     * @param {Number} type                 Type of virtual keyboard to display; from webOS.keyboard.types constants. (OPTIONAL)
     */
    forceShow: function(inType){
        this.setManualMode(true);
        if(window.PalmSystem) {
            PalmSystem.keyboardShow(inType || 0);
        }
    },

    /**
     * Force the virtual keyboard to hide. In the process, enables manual mode.
     */
    forceHide: function(){
        this.setManualMode(true);
        if(window.PalmSystem) {
            PalmSystem.keyboardHide();
        }
    }
};
