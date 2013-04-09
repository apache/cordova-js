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

function build(plugins) {
    var builder = require('cordova/builder'),
        plugin;
    for (plugin in plugins) {
        if (plugins.hasOwnProperty(plugin)) {
            if (plugins[plugin].clobbers) {
                builder.buildIntoAndClobber(plugins[plugin].clobbers, window);
            }
            if (plugins[plugin].merges) {
                builder.buildIntoAndMerge(plugins[plugin].merges, window);
            }
        }
    }
}

module.exports = {

    loadClientJs: function (plugins, callback) {
        var plugin,
            script,
            i,
            count = 0;
        for (plugin in plugins) {
            if (plugins.hasOwnProperty(plugin) && plugins[plugin].modules) {
                for (i = 0; i < plugins[plugin].modules.length; i++) {
                    script = document.createElement('script');
                    script.src = 'local:///plugins/' + plugin + '/' + plugins[plugin].modules[i];
                    script.onload = function () {
                        if (--count === 0 && typeof callback === 'function') {
                            build(plugins);
                            callback();
                        }
                    };
                    count++;
                    document.head.appendChild(script);
                }
            }
        }
        if (count === 0) {
            callback();
        }
    },

    getPlugins: function (success, error) {
        var request,
            response;
        request = new XMLHttpRequest();
        request.open('GET', 'local:///plugins/plugins.json', true);
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    try {
                        response = JSON.parse(decodeURIComponent(request.responseText));
                        success(response);
                    }
                    catch (e) {
                        error(e);
                    }
                }
                else {
                    error(request.status);
                }
            }
        };
        request.send(null);
    }
};
