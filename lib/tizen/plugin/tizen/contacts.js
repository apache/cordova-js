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

/*global tizen:false */
var ContactError = require('cordova/plugin/ContactError'),
    utils = require('cordova/utils'),
    ContactUtils = require('cordova/plugin/tizen/ContactUtils');

module.exports = {
    /**
     * Returns an array of Contacts matching the search criteria.
     *
     * @return array of Contacts matching search criteria
     */
    find : function(fields, successCB, failCB, options) {

        // Success callback is required. Throw exception if not specified.
        if (typeof successCB !== 'function') {
            throw new TypeError("You must specify a success callback for the find command.");
        }

        // Search qualifier is required and cannot be empty.
        if (!fields || !(utils.isArray(fields)) || fields.length === 0) {
            if (typeof failCB === 'function') {
                failCB(new ContactError(ContactError.INVALID_ARGUMENT_ERROR));
            }
            return;
        }

        // options are optional
        var filter ="",
            multiple = false,
            contacts = [],
            tizenFilter = null;

        if (options) {
            filter = options.filter || "";
            multiple =  options.multiple || false;
        }

        if (filter){
            tizenFilter = ContactUtils.buildFilterExpression(fields, filter);
        }

        tizen.contact.getDefaultAddressBook().find(
            function(tizenContacts) {
                if (multiple) {
                    for (var index in tizenContacts) {
                        contacts.push(ContactUtils.createContact(tizenContacts[index], fields));
                    }
                }
                else {
                    contacts.push(ContactUtils.createContact(tizenContacts[0], fields));
                }

                // return results
                successCB(contacts);
            },
            function(error) {
                if (typeof failCB === 'function') {
                    failCB(ContactError.UNKNOWN_ERROR);
                }
            },
            tizenFilter,
            null);
    }
};
