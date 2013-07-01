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

var _isShowing = null,
    _manual = null;

module.exports = {
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
    isShowing: function() {
        return !!_isShowing;
    },
    show: function(type){
        if(this.isManualMode()) {
            PalmSystem.keyboardShow(type || 0);
        }
    },
    hide: function(){
        if(this.isManualMode()) {
            PalmSystem.keyboardHide();
        }
    },
    setManualMode: function(mode){
        _manual = mode;
        PalmSystem.setManualKeyboardEnabled(mode);
    },
    isManualMode: function(){
        return _manual || false;
    },
    forceShow: function(inType){
        this.setManualMode(true);
        PalmSystem.keyboardShow(inType || 0);
    },
    forceHide: function(){
        this.setManualMode(true);
        PalmSystem.keyboardHide();
    }
};
