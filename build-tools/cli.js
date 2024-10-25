#!/usr/bin/env node

/*!
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
 */

const { resolve } = require('node:path');
const { pipeline } = require('node:stream/promises');
const { build } = require('.');

const USAGE = `
Usage:
  cordova-js [help]
  cordova-js build [<platform-root>]
`.trim();

async function main ([cmd = 'help', ...args]) {
    if (!Object.prototype.hasOwnProperty.call(commands, cmd)) {
        console.error(`Unknown command "${cmd}"`);
        process.exitCode = 1;
        return commands.help();
    }
    return commands[cmd](args);
}

const commands = {
    help () {
        console.log(USAGE);
    },

    async build (args) {
        const platformRoot = resolve(args[0] || process.cwd());
        const bundleCode = await build({ platformRoot });
        return pipeline(
            [bundleCode],
            process.stdout
        );
    }
};

if (require.main === module) {
    main(process.argv.slice(2))
        .catch(err => {
            console.error('cordova-js failed:', err);
            process.exitCode = 1;
        });
}
