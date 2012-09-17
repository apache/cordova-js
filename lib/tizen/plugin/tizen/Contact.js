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
    ContactUtils = require('cordova/plugin/tizen/ContactUtils'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec');

// ------------------
// Utility functions
// ------------------


/**
 * Retrieves a Tizen Contact object from the device by its unique id.
 *
 * @param uid
 *            Unique id of the contact on the device
 * @return {tizen.Contact} Tizen Contact object or null if contact with
 *         specified id is not found
 */
var findByUniqueId = function(id) {

    if (!id) {
        return null;
    }

    var tizenContact = null;

    tizen.contact.getDefaultAddressBook().find(
        function _successCallback(contacts){
            tizenContact = contacts[0];
        },
        function _errorCallback(error){
            console.log("tizen find error " + error);
        },
        new tizen.AttributeFilter('id', 'CONTAINS', id),
        new tizen.SortMode('id', 'ASC'));

    return tizenContact || null;
};


var traceTizenContact = function (tizenContact) {
    console.log("cordova/plugin/tizen/Contact/  tizenContact.id " + tizenContact.id);
    console.log("cordova/plugin/tizen/Contact/  tizenContact.lastUpdated " + tizenContact.lastUpdated);
    console.log("cordova/plugin/tizen/Contact/  tizenContact.name " + tizenContact.name);
    console.log("cordova/plugin/tizen/Contact/  tizenContact.account " + tizenContact.account);
    console.log("cordova/plugin/tizen/Contact/  tizenContact.addresses " + tizenContact.addresses);
    console.log("cordova/plugin/tizen/Contact/  tizenContact.photoURI " + tizenContact.photoURI);
    console.log("cordova/plugin/tizen/Contact/  tizenContact.phoneNumbers " + tizenContact.phoneNumbers);
    console.log("cordova/plugin/tizen/Contact/  tizenContact.emails " + tizenContact.emails);
    console.log("cordova/plugin/tizen/Contact/  tizenContact.birthday " + tizenContact.birthday);
    console.log("cordova/plugin/tizen/Contact/  tizenContact.organization " + tizenContact.organization);
    console.log("cordova/plugin/tizen/Contact/  tizenContact.notes " + tizenContact.notes);
    console.log("cordova/plugin/tizen/Contact/  tizenContact.urls " + tizenContact.isFavorite);
    console.log("cordova/plugin/tizen/Contact/  tizenContact.isFavorite " + tizenContact.isFavorite);
    console.log("cordova/plugin/tizen/Contact/  tizenContact.ringtonesURI " + tizenContact.ringtonesURI);
    console.log("cordova/plugin/tizen/Contact/  tizenContact.categories " + tizenContact.categories);
};


/**
 * Creates a Tizen contact object from the W3C Contact object and persists
 * it to device storage.
 *
 * @param {Contact}
 *            contact The contact to save
 * @return a new contact object with all properties set
 */
var saveToDevice = function(contact) {

    if (!contact) {
        return;
    }

    var tizenContact = null;
    var update = false;
    var i = 0;

    // if the underlying Tizen Contact object already exists, retrieve it for
    // update
    if (contact.id) {
        // we must attempt to retrieve the BlackBerry contact from the device
        // because this may be an update operation
        tizenContact = findByUniqueId(contact.id);
    }

    // contact not found on device, create a new one
    if (!tizenContact) {
        tizenContact = new tizen.Contact();
    }
    // update the existing contact
    else {
        update = true;
    }

    // NOTE: The user may be working with a partial Contact object, because only
    // user-specified Contact fields are returned from a find operation (blame
    // the W3C spec). If this is an update to an existing Contact, we don't
    // want to clear an attribute from the contact database simply because the
    // Contact object that the user passed in contains a null value for that
    // attribute. So we only copy the non-null Contact attributes to the
    // Tizen Contact object before saving.
    //
    // This means that a user must explicitly set a Contact attribute to a
    // non-null value in order to update it in the contact database.
    //
    traceTizenContact (tizenContact);

    // display name
    if (contact.displayName !== null) {
        if (tizenContact.name === null) {
            tizenContact.name = new tizen.ContactName();
        }
        if (tizenContact.name !== null) {
            tizenContact.name.displayName = contact.displayName;
        }
    }

    // name
    if (contact.name !== null) {
        if (contact.name.givenName) {
            if (tizenContact.name === null) {
                tizenContact.name = new tizen.ContactName();
            }
            if (tizenContact.name !== null) {
                tizenContact.name.firstName = contact.name.givenName;
            }
        }

        if  (contact.name.middleName) {
            if (tizenContact.name === null) {
                tizenContact.name = new tizen.ContactName();
            }
            if (tizenContact.name !== null) {
                tizenContact.name.middleName = contact.name.middleName;
            }
        }

        if (contact.name.familyName) {
            if (tizenContact.name === null) {
                tizenContact.name = new tizen.ContactName();
            }
            if (tizenContact.name !== null) {
                tizenContact.name.lastName = contact.name.familyName;
            }
        }

        if (contact.name.honorificPrefix) {
            if (tizenContact.name === null) {
                tizenContact.name = new tizen.ContactName();
            }
            if (tizenContact.name !== null) {
                tizenContact.name.prefix = contact.name.honorificPrefix;
            }
        }
    }

    // nickname
    if (contact.nickname !== null) {
        if (tizenContact.name === null) {
            tizenContact.name = new tizen.ContactName();
        }
        if (tizenContact.name !== null) {
            if (!utils.isArray(tizenContact.name.nicknames))
            {
                tizenContact.name.nicknames = [];
            }
            tizenContact.name.nicknames[0] = contact.nickname;
        }
    }
    else {
        tizenContact.name.nicknames = [];
    }

    // note
    if (contact.note !== null) {
        if (tizenContact.note === null) {
            tizenContact.note = [];
        }
        if (tizenContact.note !== null) {
            tizenContact.note[0] = contact.note;
        }
    }

    // photos
    if (contact.photos && utils.isArray(contact.emails) && contact.emails.length > 0) {
        tizenContact.photoURI = contact.photos[0];
    }

    if (utils.isDate(contact.birthday)) {
        if (!utils.isDate(tizenContact.birthday)) {
            tizenContact.birthday = new Date();
        }
        if (utils.isDate(tizenContact.birthday)) {
            tizenContact.birthday.setDate(contact.birthday.getDate());
        }
    }

    // Tizen supports many addresses
    if (utils.isArray(contact.emails)) {

        // if this is an update, re initialize email addresses
        if (update) {
            // doit on effacer sur un update??????
        }

        // copy the first three email addresses found
        var emails = [];
        for (i = 0; i < contact.emails.length; i += 1) {
            var emailTypes = [];

            emailTypes.push (contact.emails[i].type);

            if (contact.emails[i].pref) {
                emailTypes.push ("PREF");
            }

            emails.push(
                new tizen.ContactEmailAddress(
                    contact.emails[i].value,
                    emailTypes)
            );
        }
        tizenContact.emails = emails.length > 0 ? emails : [];
    }
    else {
        tizenContact.emails = [];
    }

    // Tizen supports many phone numbers
    // copy into appropriate fields based on type
    if (utils.isArray(contact.phoneNumbers)) {
        // if this is an update, re-initialize phone numbers
        if (update) {
        }

        var phoneNumbers = [];

        for (i = 0; i < contact.phoneNumbers.length; i += 1) {

            if (!contact.phoneNumbers[i] || !contact.phoneNumbers[i].value) {
                continue;
            }

             var phoneTypes = [];
             phoneTypes.push (contact.phoneNumbers[i].type);

             if (contact.phoneNumbers[i].pref) {
                 phoneTypes.push ("PREF");
             }

            phoneNumbers.push(
                new tizen.ContactPhoneNumber(
                    contact.phoneNumbers[i].value,
                    phoneTypes)
            );
        }

        tizenContact.phoneNumbers = phoneNumbers.length > 0 ? phoneNumbers : [];
    } else {
        tizenContact.phoneNumbers = [];
    }

    if (utils.isArray(contact.addresses)) {
        // if this is an update, re-initialize addresses
        if (update) {
        }

        var addresses = [],
            address = null;

        for ( i = 0; i < contact.addresses.length; i += 1) {
            address = contact.addresses[i];

            if (!address || address.id === undefined || address.pref === undefined || address.type === undefined || address.formatted === undefined) {
                continue;
            }

            var addressTypes = [];
            addressTypes.push (address.type);

            if (address.pref) {
                addressTypes.push ("PREF");
            }

            addresses.push(
                new tizen.ContactAddress({
                         country:                   address.country,
                         region :                   address.region,
                         city:                      address.locality,
                         streetAddress:             address.streetAddress,
                         additionalInformation:     "",
                         postalCode:                address.postalCode,
                         types :                    addressTypes
                }));

        }
        tizenContact.addresses = addresses.length > 0 ? addresses : [];

    } else{
        tizenContact.addresses = [];
    }

    // copy first url found to BlackBerry 'webpage' field
    if (utils.isArray(contact.urls)) {
        // if this is an update, re-initialize web page
        if (update) {
        }

        var url = null,
            urls = [];

        for ( i = 0; i< contact.urls.length; i+= 1) {
            url = contact.urls[i];

            if (!url || !url.value) {
                continue;
            }

            urls.push( new tizen.ContactWebSite(url.value, url.type));
        }
        tizenContact.urls = urls.length > 0 ? urls : [];
    } else{
        tizenContact.urls = [];
    }

    if (utils.isArray(contact.organizations && contact.organizations.length > 0) ) {
        // if this is an update, re-initialize org attributes
        var organization = contact.organizations[0];

         tizenContact.organization = new tizen.ContacOrganization({
             name:          organization.name,
             department:    organization.department,
             office:        "",
             title:         organization.title,
             role:          "",
             logoURI:       ""
         });
    }

    // categories
    if (utils.isArray(contact.categories)) {
        tizenContact.categories = [];

        var category = null;

        for (i = 0; i < contact.categories.length; i += 1) {
            category = contact.categories[i];

            if (typeof category === "string") {
                tizenContact.categories.push(category);
            }
        }
    }
    else {
        tizenContact.categories = [];
    }

    // save to device
    // in tizen contact mean update or add
    // later we might use addBatch and updateBatch
    if (update){
        tizen.contact.getDefaultAddressBook().update(tizenContact);
    }
    else {
        tizen.contact.getDefaultAddressBook().add(tizenContact);
    }

    // Use the fully populated Tizen contact object to create a
    // corresponding W3C contact object.
    return ContactUtils.createContact(tizenContact, [ "*" ]);
};


/**
 * Creates a Tizen ContactAddress object from a W3C ContactAddress.
 *
 * @return {tizen.ContactAddress} a Tizen ContactAddress object
 */
var createTizenAddress = function(address) {

    var type = null,
        pref = null,
        typesAr = [];

    if (address === null) {
        return null;
    }


    var tizenAddress = new tizen.ContactAddress();

    if (tizenAddress === null) {
        return null;
    }

    typesAr.push(address.type);

    if (address.pref) {
        typesAr.push("PREF");
    }

    tizenAddress.country = address.country || "";
    tizenAddress.region = address.region || "";
    tizenAddress.city = address.locality || "";
    tizenAddress.streetAddress = address.streetAddress || "";
    tizenAddress.postalCode = address.postalCode || "";
    tizenAddress.types = typesAr || "";

    return tizenAddress;
};

module.exports = {
    /**
     * Persists contact to device storage.
     */

    save : function(successCB, failCB) {

        try {
            // save the contact and store it's unique id
            var fullContact = saveToDevice(this);

            this.id = fullContact.id;

            // This contact object may only have a subset of properties
            // if the save was an update of an existing contact. This is
            // because the existing contact was likely retrieved using a
            // subset of properties, so only those properties were set in the
            // object. For this reason, invoke success with the contact object
            // returned by saveToDevice since it is fully populated.

            if (typeof successCB === 'function') {
                successCB(fullContact);
            }
        }
        catch (error) {
            console.log('Error saving contact: ' +  error);

            if (typeof failCB === 'function') {
                failCB (new ContactError(ContactError.UNKNOWN_ERROR));
            }
        }
    },

    /**
     * Removes contact from device storage.
     *
     * @param successCB
     *            successCB callback
     * @param failCB
     *            error callback
     */
    remove : function (successCB, failCB) {

        try {
            // retrieve contact from device by id
            var tizenContact = null;

            if (this.id) {
                tizenContact = findByUniqueId(this.id);
            }


            // if contact was found, remove it
            if (tizenContact) {

                tizen.contact.getDefaultAddressBook().remove(tizenContact.id);

                if (typeof success === 'function') {
                    successCB(this);
                }
            }
            // attempting to remove a contact that hasn't been saved
            else if (typeof failCB === 'function') {
                failCB(new ContactError(ContactError.UNKNOWN_ERROR));
            }
        }
        catch (error) {
            console.log('Error removing contact ' + this.id + ": " + error);
            if (typeof failCB === 'function') {
                failCB(new ContactError(ContactError.UNKNOWN_ERROR));
            }
        }
    }
};
