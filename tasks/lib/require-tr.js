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
 */

var fs = require('fs');
var path = require('path');
var through = require('through');
var UglifyJS = require('uglify-js');
var root = fs.realpathSync(path.join(__dirname, '..', '..'));

function _updateRequires(code) {
  
  var ast = UglifyJS.parse(code);

  var walker = new UglifyJS.TreeWalker(function(node) {
    // check all function calls
    if(node instanceof UglifyJS.AST_Call) {
      // check if function call is a require('module') call
      if(node.expression.name === "require") {
        // make sure require only has one argument and that it starts with cordova (old style require.js) 
        //fs.appendFileSync('/tmp/foo', JSON.stringify(node.args[0]) + "###\n");
        if(node.args.length === 1 && 
           node.args[0].value !== undefined &&
           node.args[0].value.indexOf("cordova") === 0){
          if(node.args[0].value === "cordova") {
            node.args[0].value = path.join(root, "src", "cordova");
          } else if(node.args[0].value.match(/cordova\/(.+)/)) {
            node.args[0].value = node.args[0].value.replace(/cordova\/(.+)/, path.join(root, "src", "common", "$1"));
          }
        }
      }
    }
  });

  ast.walk(walker);

  var stream = UglifyJS.OutputStream({beautify:true});

  ast.print(stream);

  return stream.toString();
}


module.exports = function(file) {
  var data = '';

  function write(buf) {
    data += buf;
  }

  function end() {
    //fs.appendFileSync('/tmp/foo', _updateRequires(data));
    this.queue(_updateRequires(data));
    this.queue(null);
  }
 
  return through(write, end);
}
