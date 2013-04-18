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
var ContactAddress = require('cordova/plugin/ContactAddress'),
    ContactName = require('cordova/plugin/ContactName'),
    ContactField = require('cordova/plugin/ContactField'),
    ContactOrganization = require('cordova/plugin/ContactOrganization'),
    utils = require('cordova/utils'),
    Contact = require('cordova/plugin/Contact');

/**
 * Mappings for each Contact field that may be used in a find operation. Maps
 * W3C Contact fields to one or more fields in a Tizen contact object.
 *
 * Example: user searches with a filter on the Contact 'name' field:
 *
 * <code>Contacts.find(['name'], onSuccess, onFail, {filter:'Bob'});</code>
 *
 * The 'name' field does not exist in a Tizen contact. Instead, a filter
 * expression will be built to search the Tizen contacts using the
 * Tizen 'title', 'firstName' and 'lastName' fields.
 */
var fieldMappings = {
    "id" : ["id"],
    "displayName" : ["name.displayName"],
    "nickname": ["name.nicknames"],
    "name" : [ "name.prefix", "name.firstName", "name.lastName" ],
    "phoneNumbers" : ["phoneNumbers.number","phoneNumbers.types"],
    "emails" : ["emails.types", "emails.email"],
    "addresses" : ["addresses.country","addresses.region","addresses.city","addresses.streetAddress","addresses.postalCode","addresses.country","addresses.types"],
    "organizations" : ["organizations.name","organizations.department","organizations.office", "organizations.title"],
    "birthday" : ["birthday"],
    "note" : ["notes"],
    "photos" : ["photoURI"],
    "urls" : ["urls.url", "urls.type"]
};

/*
 * Build an array of all of the valid W3C Contact fields. This is used to
 * substitute all the fields when ["*"] is specified.
 */
var allFields = [];

(function() {
    for ( var key in fieldMappings) {
        allFields.push(key);
    }
})();

/**
 * Create a W3C ContactAddress object from a Tizen Address object
 *
 * @param {String}
 *            type the type of address (e.g. work, home)
 * @param {tizen.ContactAddress}
 *            tizenAddress a Tizen Address object
 * @return {ContactAddress} a contact address object or null if the specified
 *         address is null
 */
var createContactAddress = function(type, tizenAddress) {
    if (!tizenAddress) {
        return null;
    }

    var isDefault = tizenAddress.isDefault;            //Tizen 2.0
    var streetAddress = tizenAddress.streetAddress;
    var locality = tizenAddress.city || "";
    var region = tizenAddress.region || "";
    var postalCode = tizenAddress.postalCode || "";
    var country = tizenAddress.country || "";

    //TODO improve formatted
    var formatted = streetAddress + ", " + locality + ", " + region + ", " + postalCode + ", " + country;

    var contact = new ContactAddress(isDefault, type, formatted, streetAddress, locality, region, postalCode, country);

    return contact;
};

module.exports = {
    /**
     * Builds Tizen filter expressions for contact search using the
     * contact fields and search filter provided.
     *
     * @param {String[]}
     *            fields Array of Contact fields to search
     * @param {String}
     *            filter Filter, or search string
     * @param {Boolean}
     *                 multiple, one contacts or more wanted as result
     * @return filter expression or null if fields is empty or filter is null or
     *         empty
     */

    buildFilterExpression: function(fields, filter) {
        // ensure filter exists
        if (!filter || filter === "") {
            return null;
        }

        if ((fields.length === 1) && (fields[0] === "*")) {
            // Cordova enhancement to allow fields value of ["*"] to indicate
            // all supported fields.
            fields = allFields;
        }

        // build a filter expression using all Contact fields provided
        var compositeFilter = null,
            attributeFilter = null,
            filterExpression = null,
            matchFlag = "CONTAINS",
            matchValue = filter,
            attributesArray = [];

        if (fields && utils.isArray(fields)) {

            for ( var field in fields) {

                if (!fields[field]) {
                    continue;
                }

                // retrieve Tizen contact fields that map Cordova fields specified
                // (tizenFields is a string or an array of strings)
                var tizenFields = fieldMappings[fields[field]];

                if (!tizenFields) {
                    // does something maps
                    continue;
                }

                // construct the filter expression using the Tizen fields
                for ( var index in tizenFields) {
                    attributeFilter = new tizen.AttributeFilter(tizenFields[index], matchFlag, matchValue);
                    if (attributeFilter !== null) {
                        attributesArray.push(attributeFilter);
                    }
                }
            }
        }

        // fulfill Tizen find attribute as a single or a composite attribute
        if (attributesArray.length == 1 ) {
            filterExpression = attributeFilter[0];
        } else if (attributesArray.length > 1) {
            // combine the filters as a Union
            filterExpression = new tizen.CompositeFilter("UNION", attributesArray);
        } else {
            filterExpression = null;
        }

        return filterExpression;
    },


    /**
     * Creates a Contact object from a Tizen Contact object, copying only
     * the fields specified.
     *
     * This is intended as a privately used function but it is made globally
     * available so that a Contact.save can convert a BlackBerry contact object
     * into its W3C equivalent.
     *
     * @param {tizen.Contact}
     *            tizenContact Tizen Contact object
     * @param {String[]}
     *            fields array of contact fields that should be copied
     * @return {Contact} a contact object containing the specified fields or
     *         null if the specified contact is null
     */
    createContact: function(tizenContact, fields) {

        if (!tizenContact) {
            return null;
        }

        // construct a new contact object
        // always copy the contact id and displayName fields
        var contact = new Contact(tizenContact.id, tizenContact.name.displayName);


        // nothing to do
        if (!fields || !(utils.isArray(fields)) || fields.length === 0) {
            return contact;
        }
        else if (fields.length === 1 && fields[0] === "*") {
            // Cordova enhancement to allow fields value of ["*"] to indicate
            // all supported fields.
            fields = allFields;
        }

        // add the fields specified
        for ( var key in fields) {

            var field = fields[key],
                index = 0;

            if (!field) {
                continue;
            }

            // name
            if (field.indexOf('name') === 0) {
                var formattedName = (tizenContact.name.prefix || "");

                if (tizenContact.name.firstName) {
                    formattedName += ' ';
                    formattedName += (tizenContact.name.firstName || "");
                }

                if (tizenContact.name.middleName) {
                    formattedName += ' ';
                    formattedName += (tizenContact.name.middleName || "");
                }

                if (tizenContact.name.lastName) {
                    formattedName += ' ';
                    formattedName += (tizenContact.name.lastName || "");
                }

                //Tizen 2.0
                if (tizenContact.name.suffix) {
                    formattedName += ' ';
                    formattedName += (tizenContact.name.suffix || "");
                }

                contact.name = new ContactName(
                        formattedName,
                        tizenContact.name.lastName,
                        tizenContact.name.firstName,
                        tizenContact.name.middleName,
                        tizenContact.name.prefix,
                        tizenContact.name.suffix);
            }
            // phoneNumbers - Tizen 2.0
            else if (field.indexOf('phoneNumbers') === 0) {
                var phoneNumbers = [];

                for (index = 0 ; index < tizenContact.phoneNumbers.length ; ++index) {
                    phoneNumbers.push(
                        new ContactField(
                            'PHONE',
                            tizenContact.phoneNumbers[index].number,
                            tizenContact.phoneNumbers[index].isDefault));
                }
                contact.phoneNumbers = phoneNumbers.length > 0 ? phoneNumbers : null;
            }

            // emails - Tizen 2.0
            else if (field.indexOf('emails') === 0) {
                var emails = [];

                for (index = 0 ; index < tizenContact.emails.length ; ++index) {
                    emails.push(
                        new ContactField(
                            'EMAILS',
                            tizenContact.emails[index].email,
                            tizenContact.emails[index].isDefault));
                }
                contact.emails = emails.length > 0 ? emails : null;
            }

            // addresses Tizen 2.0
            else if (field.indexOf('addresses') === 0) {
                var addresses = [];
                
                for (index = 0 ; index < tizenContact.addresses.length ; ++index) {
                    addresses.push(
                         new ContactAddress(
                            tizenContact.addresses[index].isDefault,
                            tizenContact.addresses[index].types[0] ? tizenContact.addresses[index].types[0] : "HOME",
                            null,
                            tizenContact.addresses[index].streetAddress,
                            tizenContact.addresses[index].city,
                            tizenContact.addresses[index].region,
                            tizenContact.addresses[index].postalCode,
                            tizenContact.addresses[index].country ));
                }
                contact.addresses = addresses.length > 0 ? addresses : null;
            }

            // birthday
            else if (field.indexOf('birthday') === 0) {
                if (utils.isDate(tizenContact.birthday)) {
                    contact.birthday = tizenContact.birthday;
                }
            }

            // note only one in Tizen Contact -Tizen 2.0
            else if (field.indexOf('note') === 0) {
                if (tizenContact.notes) {
                    contact.note = tizenContact.notes[0];
                }
            }
            // organizations Tizen 2.0
            else if (field.indexOf('organizations') === 0) {
                var organizations = [];
                
                for (index = 0 ; index < tizenContact.organizations.length ; ++index) {
                    organizations.push(
                            new ContactOrganization(
                                    (index === 0),
                                    'WORK',
                                    tizenContact.organizations.name,
                                    tizenContact.organizations.department,
                                    tizenContact.organizations.jobTitle));
                }
                contact.organizations = organizations.length > 0 ? organizations : null;
            }

            // urls
            else if (field.indexOf('urls') === 0) {
                var urls = [];

                if (tizenContact.urls) {
                    for (index = 0 ; index <tizenContact.urls.length ; ++index) {
                        urls.push(
                                new ContactField(
                                        tizenContact.urls[index].type,
                                        tizenContact.urls[index].url,
                                        (index === 0)));
                    }
                }
                contact.urls = urls.length > 0 ? urls : null;
            }

            // photos
            else if (field.indexOf('photos') === 0) {
                var photos = [];

                if (tizenContact.photoURI) {
                    photos.push(new ContactField('URI', tizenContact.photoURI, true));
                }
                contact.photos = photos.length > 0 ? photos : null;
            }
        }

        return contact;
    }
};
