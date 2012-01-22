var exec = require('phonegap/exec'),
    ContactError = require('phonegap/plugin/ContactError'),
    Contact = require('phonegap/plugin/Contact');

/**
* Represents a group of Contacts.
* @constructor
*/
var Contacts = function() {
    this.inProgress = false;
    this.records = [];
};
/**
 * Returns an array of Contacts matching the search criteria.
 * @param fields that should be searched
 * @param successCB success callback
 * @param errorCB error callback
 * @param {ContactFindOptions} options that can be applied to contact searching
 * @return array of Contacts matching search criteria
 */
Contacts.prototype.find = function(fields, successCB, errorCB, options) {
    if (successCB === null) {
        throw new TypeError("You must specify a success callback for the find command.");
    }
    if (fields === null || fields === "undefined" || fields.length === "undefined" || fields.length <= 0) {
        if (typeof errorCB === "function") {
            errorCB(new ContactError(ContactError.INVALID_ARGUMENT_ERROR));
        }
    } else {
        exec(successCB, errorCB, "Contacts", "search", [fields, options]);
    }
};

/**
 *
 * This function creates a new contact, but it does not persist the contact
 * to device storage. To persist the contact to device storage, invoke
 * contact.save().
 * @param properties an object who's properties will be examined to create a new Contact
 * @returns new Contact object
 */
Contacts.prototype.create = function(properties) {
    var i;
    var contact = new Contact();
    for (i in properties) {
        if (typeof contact[i] !== 'undefined' && properties.isOwnProperty(i)) {
            contact[i] = properties[i];
        }
    }
    return contact;
};


module.exports = new Contacts();
