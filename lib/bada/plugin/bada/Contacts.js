var allowedAddressTypes = ["WORK", "HOME", "PREF"];

var allowedPhoneNumberTypes = ["WORK", "PREF", "HOME", "VOICE", "FAX", "MSG", "CELL", "PAGER","BBS", "MODEM", "CAR", "ISDN","VIDEO", "PCS"];

var allowedFilters = ["firstName", "lastName", "phoneticName", "nickname", "phoneNumber", "email", "address"];

function _pgToWac(contact) {
    var i, j;
    var wacContact = {};

    if(contact.id) {
        wacContact.id = contact.id;
    }

    // name
    if(contact.name) {
       wacContact.firstName = contact.name.givenName;
       wacContact.lastName = contact.name.familyName;
    }

    // nickname
    if(contact.nickname) {
        wacContact.nicknames = [contact.nickname];
    }

    // phoneNumbers
    if(contact.phoneNumbers && contact.phoneNumbers.length > 0) {
        wacContact.phoneNumbers = {};
        for(i = 0, j = contact.phoneNumbers.length ; i < j ; i += 1) {
            var wacPhoneNumber = {};
            wacPhoneNumber.number = contact.phoneNumbers[i].value;
            if(allowedPhoneNumberTypes.indexOf(contact.phoneNumbers[i].type) != -1) {
                wacPhoneNumber.types = [contact.phoneNumbers[i].type];
                if(contact.phoneNumbers[i].pref === true) {
                    wacPhoneNumber.types.push('PREF');
                }
                wacContact.phoneNumbers.push(wacPhoneNumber);
            }
        }
    }

    // emails
    if(contact.emails &&  contact.emails.length > 0) {
        wacContact.emails = [];
        for(i = 0, j = contact.emails.length ; i < j ; i +=1) {
            var wacEmailAddress = {};
            wacEmailAddress.email = contact.emails[i].value;
            if(allowedAddressTypes.indexOf(contact.emails[i].type) != -1) {
                wacEmailAddress.types = [contact.emails[i].type];
                if(contact.emails[i].pref === true) {
                    wacEmailAddress.types.push('PREF');
                }
                wacContact.emails.push(wacEmailAddress);
            }
        }
    }
    // addresses
    if(contact.addresses && contact.addresses.length > 0) {
        wacContact.addresses = [];
        for(i = 0, j = contact.emails.length ; i < j ; i +=1) {
            var wacAddress = {};
            wacAddress.country = contact.addresses[i].country;
            wacAddress.postalCode = contact.addresses[i].postalCode;
            wacAddress.region = contact.addresses[i].region;
            wacAddress.city = contact.addresses[i].locality;
            wacAddress.streetAddress = contact.addresses[i].streetAddress;
            if(allowedAddressTypes.indexOf(contact.addresses[i].type) != -1) {
                wacAddress.types = [contact.addresses[i].type];
                if(contact.addresses[i].pref === true) {
                    wacAddress.types.push('PREF');
                }
            }
            wacContact.addresses.push(wacAddress);
        }

    }

    // photos
    // can only store one photo URL
    if(contact.photos && contact.photos.length > 0) {
       wacContact.photoURL = contact.photos[0].value;
    }

    return wacContact;

}

function _wacToPg(contact) {
    var i, j;
    var pgContact = {};

    if(contact.id) {
        pgContact.id = contact.id;
    }

    // name
    if(contact.firstName || contact.lastName) {
        pgContact.name = {};
        pgContact.name.givenName = contact.firstName;
        pgContact.name.familyName = contact.lastName;
        pgContact.displayName = contact.firstName + ' ' + contact.lastName;
    }

    // nicknames
    if(contact.nicknames && contact.nicknames.length > 0) {
        pgContact.nickname = contact.nicknames[0];
    }

    // phoneNumbers
    if(contact.phoneNumbers && contact.phoneNumbers.length > 0) {
        pgContact.phoneNumbers = [];
        for(i = 0, j = contact.phoneNumbers.length ; i < j ; i += 1) {
            var pgPhoneNumber = {};
            pgPhoneNumber.value = contact.phoneNumbers[i].number;
            if(contact.phoneNumbers[i].types &&
               contact.phoneNumbers[i].types.length > 0) {
                pgPhoneNumber.type = contact.phoneNumbers[i].types[0];
                if(contact.phoneNumbers[i].types.indexOf('PREF') != -1) {
                    pgPhoneNumber.pref = true;
                }
            }
            pgContact.phoneNumbers.push(pgPhoneNumber);
        }
    }

    // emails
    if(contact.emails && contact.emails.length > 0) {
        pgContact.emails = [];
        for(i = 0, j = contact.emails.length ; i < j ; i += 1) {
            var pgEmailAddress = {};
            pgEmailAddress.value = contact.emails[i].email;
            if(contact.emails[i].types &&
               contact.emails[i].types.length > 0) {
                pgEmailAddress.type = contact.emails[i].types[0];
                if(contact.emails[i].types.indexOf('PREF') != -1) {
                    pgEmailAddress.pref = true;
                }
            }
            pgContact.emails.push(pgEmailAddress);
        }
    }

    // addresses
    if(contact.addresses && contact.addresses.length > 0) {
        pgContact.addresses = [];
        for(i = 0, j = contact.addresses.length ; i < j ; i += 1) {
            var pgAddress = {};
            pgAddress.country = contact.addresses[i].country;
            pgAddress.postalCode = contact.addresses[i].postalCode;
            pgAddress.region = contact.addresses[i].region;
            pgAddress.locality = contact.addresses[i].city;
            pgAddress.streetAddress = contact.addresses[i].streetAddress;
            if(contact.addresses[i].types &&
               contact.addresses[i].types.length > 0) {
                pgAddress.type = contact.addresses[i].types[0];
                if(contact.addresses[i].types.indexOf('PREF') != -1) {
                    pgAddress.pref = true;
                }
            }
            pgContact.addresses.push(pgAddress);
        }
    }

    // photos
    // can only store one photo URL
    if(contact.photoURL) {
       pgContact.photos = [{value: contact.photoURL, type: "DEFAULT"}];
    }

    return pgContact;
}

function _buildWacFilters(fields, options) {
    var i, j;
    var wacFilters = {};
    for(i = 0, j = fields.length ; i < j ; i += 1) {
        if(allowedFilters.indexOf(fields[i]) != -1) {
           wacFilters[fields[i]] = options.filter;
        }
    }
}

module.exports = {
    save: function(success, fail, params) {
        var pContact = params[0];
        var gotBooks = function(books) {
            var book = books[0];
            var i, j;
            var saveSuccess = function(wContact) {
                success(_wacToPg(wContact));
            };
            var saveError = function(e) {
                fail(e);
            };
            if(pContact.id) {
                book.updateContact(saveSuccess, saveError, _pgToWac(pContact));
            } else {
                var wContact = book.createContact(_pgToWac(pContact));
                book.addContact(saveSuccess, saveError, wContact);
            }
        };
        var gotError = function(e) {
            fail(e);
        };
        deviceapis.pim.contact.getAddressBooks(gotBooks, gotError);
    },
    remove: function(success, fail, params) {
        var id = params[0];
        var gotBooks = function(books) {
            var book = books[0];
            var removeSuccess = function() {
                success();
            };
            var removeError = function(e) {
                fail(e);
            };
            var toDelete = function(contacts) {
                if(contacts.length === 1) {
                    book.deleteContact(removeSuccess, removeError, contacts[0].id);
                }
            };
            if(id) {
                book.findContacts(toDelete, removeError, {id: id});
            }
        };
        var gotError = function(e) {
            fail(e);
        };
        deviceapis.pim.contact.getAddressBooks(gotBooks, gotError);
    },
    search: function(success, fail, params) {
        var fields = params[0];
        var options = params[1];
        var wacFilters = _buildWacFilters(fields, options);
        var gotBooks = function(books) {
            var book = books[0];
            var gotContacts = function(contacts) {
                var i, j;
                var pgContacts = [];
                for(i = 0, j = contacts.length ; i < j ; i += 1) {
                    pgContacts.push(_wacToPg(contacts[i]));
                }
                success(pgContacts);
            };
            var gotError = function(e) {
                fail(e);
            };
            book.findContacts(gotContacts, gotError, wacFilters);
        };
        var gotError = function(e) {
            fail(e);
        };
        deviceapis.pim.contact.getAddressBooks(gotBooks, gotError);
    }
};
