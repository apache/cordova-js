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

/*
 * This probably should live in plugman/cli world
 * Transoforms old require calls to new node-style require calls
 * the whole thing is fucking bullshit and needs to disappear ASAP
 */

var fs = require('fs');
var path = require('path');
var util = require('util');
var through = require('through');
var UglifyJS = require('uglify-js');
var os = require('os');
var root = fs.realpathSync(path.join(__dirname, '..', '..'));

var requireTr = {

  init: function(platform) {
    this.platform = platform;
    this.modules = [];
  },

  transform: function(file) {
    var data = '';

    function write(buf) {
      data += buf;
    }

    function end() {
        // SOME BS pre-transforms
      if(data.match(/clobbers\('cordova\/plugin\/android\/app/)) {
        // Checking for '\' from the windows path
        root = root.replace(/\\/g, '/');

        if(file.match(/android\/platform.js$/) || file.match(/android\\platform.js$/)) {
          data = data.replace(/modulemapper\.clobbers.*\n/,
                              util.format('navigator.app = require("%s/src/android/plugin/android/app")', root));
        } else if (file.match(/amazon-fireos\/platform.js$/) || file.match(/amazon-fireos\\platform.js$/)) {
          data = data.replace(/modulemapper\.clobbers.*\n/,
                              util.format('navigator.app = require("%s/src/amazon-fireos/plugin/android/app")', root));
        }
      }

      if(data.match(/clobbers\('cordova\/exec\/proxy/)) {
        // Checking for '\' from the windows path
        root = root.replace(/\\/g, '/');

        data = data.replace(/modulemapper\.clobbers.*\n/,
                            util.format('cordova.commandProxy = require("%s/src/common/exec/proxy");', root));
      }

      if(file.match(/FileReader.js$/)) {
        data = data.replace(/getOriginalSymbol\(this/,
                            'getOriginalSymbol(window');
      }
     
      this.queue(_updateRequires(data));
      this.queue(null);
    }
   
    return through(write, end);
  },
  hasModule: function(module) {
    for(var i = 0, j = this.modules.length ; i < j ; i++) {
      if(this.modules[i].symbol === module) {
        return true;
      }
    }
    return false;
  },
  getModules: function() {
    return this.modules;
  },
  getPlatform: function() {
    return this.platform;
  },
  addModule: function(module) {
    if(!module || !module.symbol || !module.path) {
      throw new Error("Can't add module without a symbol and a path");
    }
    this.modules.push(module);
  },
  modules:[],
  platform: null
}

/*
 * visits AST and modifies all the require('cordova/*') and require('org.apache.cordova.*')
 */
function _updateRequires(code) {
  var ast = UglifyJS.parse(code);

  var before = new UglifyJS.TreeTransformer(function(node, descend) {

    // check all function calls
    if(node instanceof UglifyJS.AST_Call) {
      // check if function call is a require('module') call
      if(node.expression.name === "require" && node.args.length === 1) {

        // Uglify is not able to recognize Windows style paths using '\' instead of '/'
        // So replacing all of the '/' back to Windows '\'
        if (node.args[0].value !== undefined && node.args[0].value.indexOf(root) !== -1 && process.platform === 'win32') {
            node.args[0].value = node.args[0].value.replace(/\//g, '\\');
        }

        var module = node.args[0].value;

        // make sure require only has one argument and that it starts with cordova (old style require.js)
        if(module !== undefined &&
           module.indexOf("cordova") === 0) {

          var scriptpath;

          // require('cordova') -> cordova.js
          if(module === "cordova") {
            scriptPath = node.args[0].value = path.join(root, "src", "cordova_b");
          // require('cordova/init') -> common/init
          }  else if(module.match(/cordova\/init/)) {
            scriptPath = node.args[0].value = module.replace(/cordova\/init/,
                                    path.join(root, "src", "common", "init_b"));
          // android and amazon-fireos have some special require's
          } else if(module.match(/cordova\/(android|amazon-fireos)\/(.+)/)) {
            scriptPath = node.args[0].value = module.replace(/cordova\/(android|amazon-fireos)\/(.+)/,
                                    path.join(root, "src", "$1", "android", "$2"));
          // require('cordova/exec') and require('cordova/platform') -> platform's exec/platform
          } else if(module.match(/cordova\/(platform|exec)$/)) {
            scriptPath = node.args[0].value = module.replace(/cordova\/(platform|exec)/,
                                                path.join(root, "src", requireTr.getPlatform(), "$1"));
          // require('cordova/anything') should be under common/
          } else if(module.match(/cordova\/(.+)/)) {
            scriptPath = node.args[0].value = module.replace(/cordova\/(.+)/,
                                    path.join(root, "src", "common", "$1"));
          }
          if(requireTr.hasModule(module) === false) {
            requireTr.addModule({symbol: module, path: scriptPath});
          }
        }
        else if(module !== undefined && ( module.indexOf("org.apache.cordova") !== -1 ||
                                          module.indexOf("./") === 0 || module.indexOf("../") === 0 ) ) {
          var modules = requireTr.getModules();

          if(module.indexOf("../") === 0){
            module = module.replace('../', '');
          }
          if(module.indexOf("./") === 0 ) {
            module = module.replace('./', '');
          }

          for(var i = 0, j = modules.length ; i < j ; i++) {
            var regx = new RegExp ("\\."+ module + "$");
            if(module === modules[i].symbol || modules[i].symbol.search(regx) != -1) {
                node.args[0].value = modules[i].path;
                break;
            }
          }
        }
        descend(node, this);
        return node;
      }
    }
  });

  ast.transform(before, null);

  var stream = UglifyJS.OutputStream({beautify:true});

  ast.print(stream);

  return stream.toString();
}


module.exports = requireTr; 
