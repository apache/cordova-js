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

var modulemapper = require('cordova/modulemapper');

modulemapper.merges('cordova/plugin/webos/extras/window', 'navigator.window');
modulemapper.merges('cordova/plugin/webos/extras/orientation', 'navigator.orientation');
modulemapper.merges('cordova/plugin/webos/extras/keyboard', 'navigator.keyboard');
modulemapper.merges('cordova/plugin/webos/extras/pmloglib', 'webOS');  //merges logging into this module
modulemapper.merges('cordova/plugin/webos/extras/localemonitor', 'navigator.localeMonitor');

modulemapper.mapModules(window);

module.exports={
	fetchAppId: function() {
		if (window.PalmSystem) {
			// PalmSystem.identifier: <appid> <processid>
			return PalmSystem.identifier.split(" ")[0];
		}
	},
	fetchAppInfo: function() {
		if(!this.appInfo) {
			var appInfoPath = this.fetchAppRootPath() + "appinfo.json";
			var appInfoJSON = undefined;
			if(window.palmGetResource) {
				try {
					appInfoJSON = palmGetResource(appInfoPath);
				} catch(e) {
					console.log("error reading appinfo.json" + e.message);
				}
			} else {
				var req = new XMLHttpRequest();
				req.open('GET', appInfoPath + "?palmGetResource=true", false);
				req.send(null);
				if(req.status >= 200 && req.status < 300) {
					appInfoJSON = req.responseText;
				} else {
					console.log("error reading appinfo.json");
				}
			}
			if(appInfoJSON) {
				this.appInfo = enyo.json.parse(appInfoJSON);
			}
		}
		return this.appInfo;
	},
	fetchAppRootPath: function() {
		var base = window.location.href;
		if('baseURI' in window.document) {
			base = window.document.baseURI;
		} else {
			var baseTags = window.document.getElementsByTagName("base");
			if(baseTags.length > 0) {
				base = baseTags[0].href;
			}
		}
		var match = base.match(new RegExp(".*:\/\/[^#]*\/"));
		if(match) {
			return match[0];
		}
		return "";
	}
};
