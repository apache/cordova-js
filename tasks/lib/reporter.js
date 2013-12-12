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

From the jasmine-node project: https://github.com/mhevery/jasmine-node

The MIT License

Copyright (c) 2010 Adam Abrons and Misko Hevery http://getangular.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

//
// Imports
//
var util;
try {
  util = require('util')
} catch(e) {
  util = require('sys')
}


//
// Helpers
//
function noop() {}

printRunnerResults = function(runner){
  var results = runner.results();
  var specs = runner.specs();
  var msg = '';
  msg += specs.length + ' test' + ((specs.length === 1) ? '' : 's') + ', ';
  msg += results.totalCount + ' assertion' + ((results.totalCount === 1) ? '' : 's') + ', ';
  msg += results.failedCount + ' failure' + ((results.failedCount === 1) ? '' : 's') + '\n';
  return msg;
};

ANSIColors = {
  pass:    function() { return '\033[32m'; }, // Green
  fail:    function() { return '\033[31m'; }, // Red
  neutral: function() { return '\033[0m';  }  // Normal
};

NoColors = {
  pass:    function() { return ''; },
  fail:    function() { return ''; },
  neutral: function() { return ''; }
};

//
// Reporter implementation
//
TerminalReporter = function(config) {
  this.print_      = config.print      || util.print;
  this.isVerbose_  = config.verbose    || false;
  this.onComplete_ = config.onComplete || noop;
  this.color_      = config.color? ANSIColors: NoColors;
  this.stackFilter = config.stackFilter || function(t) { return t; }

  this.columnCounter_ = 0;
  this.log_           = [];
  this.start_         = 0;
};

TerminalReporter.prototype = {
  // Public Methods //
  log: noop,

  reportSpecStarting: noop,

  reportRunnerStarting: function(runner) {
    this.printLine_('Started');
    this.start_ = Number(new Date);
  },

  reportSuiteResults: function(suite) {
    var specResults = suite.results();
    var path = [];
    while(suite) {
      path.unshift(suite.description);
      suite = suite.parentSuite;
    }
    var description = path.join(' ');

    if (this.isVerbose_)
      this.log_.push('Spec ' + description);

    outerThis = this;
    specResults.items_.forEach(function(spec){
      if (spec.description && spec.failedCount > 0) {
        if (!outerThis.isVerbose_)
          outerThis.log_.push(description);
        outerThis.log_.push('  it ' + spec.description);
        spec.items_.forEach(function(result){
        if (!result.passed_) {
    			var errorMessage = result.trace.stack || result.message;
            if(outerThis.teamcity_) {
              outerThis.log_.push("##teamcity[testFailed name='" +  escapeTeamcityString(spec.description) + "' message='[FAILED]' details='" + escapeTeamcityString(outerThis.stackFilter(outerThis.stackFilter(errorMessage))) + "']");
            } else {
              outerThis.log_.push(result.message.indexOf('timeout:') == 0 ?
                                  '  TIMEOUT:' + result.message.substr(8) :
                                  '  ' +  outerThis.stackFilter(errorMessage) + '\n');
            }
          }
        });
      } else {
        if (outerThis.isVerbose_) {
          outerThis.log_.push('  it ' + spec.description);
        }
      }
    });
  },

  reportSpecResults: function(spec) {
    var result = spec.results();
    var msg = '';
    if (result.passed()) {
      msg = this.stringWithColor_('.', this.color_.pass());
      //      } else if (result.skipped) {  TODO: Research why "result.skipped" returns false when "xit" is called on a spec?
      //        msg = (colors) ? (ansi.yellow + '*' + ansi.none) : '*';
    } else {
      msg = this.stringWithColor_('F', this.color_.fail());
    }
    this.print_(msg);
    if (this.columnCounter_++ < 50) return;
    this.columnCounter_ = 0;
    this.print_('\n');
  },

  reportRunnerResults: function(runner) {
    var elapsed = (Number(new Date) - this.start_) / 1000;
    var owner   = this;

    this.printLine_('\n');
    this.log_.forEach(function(entry) {
      owner.printLine_(entry);
    });
    this.printLine_('Finished in ' + elapsed + ' seconds');

    var summary = printRunnerResults(runner);
    if(runner.results().failedCount === 0 ) {
      this.printLine_(this.stringWithColor_(summary, this.color_.pass()));
    }
    else {
      this.printLine_(this.stringWithColor_(summary, this.color_.fail()));
    }

    this.onComplete_(runner, this.log_);
  },

  // Helper Methods //
  stringWithColor_: function(str, color) {
    return (color || this.color_.neutral()) + str + this.color_.neutral();
  },

  printLine_: function(str) {
    this.print_(str);
    this.print_('\n');
  }

};


//
// Exports
//
exports.TerminalReporter = TerminalReporter;
