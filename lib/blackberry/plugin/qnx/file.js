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

/*global WebKitBlobBuilder:false */
var cordova = require('cordova'),
    FileError = require('cordova/plugin/FileError'),
    DirectoryEntry = require('cordova/plugin/DirectoryEntry'),
    FileEntry = require('cordova/plugin/FileEntry'),
    File = require('cordova/plugin/File'),
    FileSystem = require('cordova/plugin/FileSystem'),
    FileReader = require('cordova/plugin/FileReader'),
    nativeRequestFileSystem = window.webkitRequestFileSystem,
    nativeResolveLocalFileSystemURI = function(uri, success, fail) {
        if (uri.substring(0,11) !== "filesystem:") {
            uri = "filesystem:" + uri;
        }
        window.webkitResolveLocalFileSystemURL(uri, success, fail);
    },
    NativeFileReader = window.FileReader;

window.FileReader = FileReader;
window.File = File;

function getFileSystemName(nativeFs) {
    return (nativeFs.name.indexOf("Persistent") != -1) ? "persistent" : "temporary";
}

function makeEntry(entry) {
    if (entry.isDirectory) {
        return new DirectoryEntry(entry.name, decodeURI(entry.toURL()).substring(11));
    }
    else {
        return new FileEntry(entry.name, decodeURI(entry.toURL()).substring(11));
    }
}

module.exports = {
    /* requestFileSystem */
    requestFileSystem: function(args, successCallback, errorCallback) {
        var type = args[0],
            size = args[1];

        nativeRequestFileSystem(type, size, function(nativeFs) {
            successCallback(new FileSystem(getFileSystemName(nativeFs), makeEntry(nativeFs.root)));
        }, function(error) {
            errorCallback(error.code);
        });
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "async"};
    },

    /* resolveLocalFileSystemURI */
    resolveLocalFileSystemURI: function(args, successCallback, errorCallback) {
        var uri = args[0];

        nativeResolveLocalFileSystemURI(uri, function(entry) {
            successCallback(makeEntry(entry));
        }, function(error) {
            var code = error.code;
            switch (code) {
                case 5:
                    code = FileError.NOT_FOUND_ERR;
                    break;

                case 2:
                    code = FileError.ENCODING_ERR;
                    break;
            }
            errorCallback(code);
        });
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "async"};
    },

    /* DirectoryReader */
    readEntries: function(args, successCallback, errorCallback) {
        var uri = args[0];

        nativeResolveLocalFileSystemURI(uri, function(dirEntry) {
            var reader = dirEntry.createReader();
            reader.readEntries(function(entries) {
                var retVal = [];
                for (var i = 0; i < entries.length; i++) {
                    retVal.push(makeEntry(entries[i]));
                }
                successCallback(retVal);
            }, function(error) {
                errorCallback(error.code);
            });
        }, function(error) {
            errorCallback(error.code);
        });
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "async"};
    },

    /* Entry */
    getMetadata: function(args, successCallback, errorCallback) {
        var uri = args[0];

        nativeResolveLocalFileSystemURI(uri, function(entry) {
            entry.getMetadata(function(metaData) {
                successCallback(metaData.modificationTime);
            }, function(error) {
                errorCallback(error.code);
            });
        }, function(error) {
            errorCallback(error.code);
        });
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "async"};
    },

    moveTo: function(args, successCallback, errorCallback) {
        var srcUri = args[0],
            parentUri = args[1],
            name = args[2];

        nativeResolveLocalFileSystemURI(srcUri, function(source) {
            nativeResolveLocalFileSystemURI(parentUri, function(parent) {
                source.moveTo(parent, name, function(entry) {
                    successCallback(makeEntry(entry));
                }, function(error) {
                    errorCallback(error.code);
                });
            }, function(error) {
                errorCallback(error.code);
            });
        }, function(error) {
            errorCallback(error.code);
        });
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "async"};
    },

    copyTo: function(args, successCallback, errorCallback) {
        var srcUri = args[0],
            parentUri = args[1],
            name = args[2];

        nativeResolveLocalFileSystemURI(srcUri, function(source) {
            nativeResolveLocalFileSystemURI(parentUri, function(parent) {
                source.copyTo(parent, name, function(entry) {
                    successCallback(makeEntry(entry));
                }, function(error) {
                    errorCallback(error.code);
                });
            }, function(error) {
                errorCallback(error.code);
            });
        }, function(error) {
            errorCallback(error.code);
        });
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "async"};
    },

    remove: function(args, successCallback, errorCallback) {
        var uri = args[0];

        nativeResolveLocalFileSystemURI(uri, function(entry) {
            if (entry.fullPath === "/") {
                errorCallback(FileError.NO_MODIFICATION_ALLOWED_ERR);
            } else {
                entry.remove(
                    function (success) {
                        if (successCallback) {
                            successCallback(success);
                        }
                    },
                    function(error) {
                        if (errorCallback) {
                            errorCallback(error.code);
                        }
                    }
                );
            }
        }, function(error) {
            errorCallback(error.code);
        });
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "async"};
    },

    getParent: function(args, successCallback, errorCallback) {
        var uri = args[0];

        nativeResolveLocalFileSystemURI(uri, function(entry) {
            entry.getParent(function(entry) {
                successCallback(makeEntry(entry));
            }, function(error) {
                errorCallback(error.code);
            });
        }, function(error) {
            errorCallback(error.code);
        });
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "async"};
    },

    /* FileEntry */
    getFileMetadata: function(args, successCallback, errorCallback) {
        var uri = args[0];

        nativeResolveLocalFileSystemURI(uri, function(entry) {
            entry.file(function(file) {
                var retVal = new File(file.name, decodeURI(entry.toURL()), file.type, file.lastModifiedDate, file.size);
                successCallback(retVal);
            }, function(error) {
                errorCallback(error.code);
            });
        }, function(error) {
            errorCallback(error.code);
        });
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "async"};
    },

    /* DirectoryEntry */
    getDirectory: function(args, successCallback, errorCallback) {
        var uri = args[0],
            path = args[1],
            options = args[2];

        nativeResolveLocalFileSystemURI(uri, function(entry) {
            entry.getDirectory(path, options, function(entry) {
                successCallback(makeEntry(entry));
            }, function(error) {
                if (error.code === FileError.INVALID_MODIFICATION_ERR) {
                    if (options.create) {
                        errorCallback(FileError.PATH_EXISTS_ERR);
                    } else {
                        errorCallback(FileError.ENCODING_ERR);
                    }
                } else {
                    errorCallback(error.code);
                }
            });
        }, function(error) {
            errorCallback(error.code);
        });
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "async"};
    },

    removeRecursively: function(args, successCallback, errorCallback) {
        var uri = args[0];

        nativeResolveLocalFileSystemURI(uri, function(entry) {
            if (entry.fullPath === "/") {
                errorCallback(FileError.NO_MODIFICATION_ALLOWED_ERR);
            } else {
                entry.removeRecursively(
                    function (success) {
                        if (successCallback) {
                            successCallback(success);
                        }
                    },
                    function(error) {
                        errorCallback(error.code);
                    }
                );
            }
        }, function(error) {
            errorCallback(error.code);
        });
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "async"};
    },

    getFile: function(args, successCallback, errorCallback) {
        var uri = args[0],
            path = args[1],
            options = args[2];

        nativeResolveLocalFileSystemURI(uri, function(entry) {
            entry.getFile(path, options, function(entry) {
                successCallback(makeEntry(entry));
            }, function(error) {
                if (error.code === FileError.INVALID_MODIFICATION_ERR) {
                    if (options.create) {
                        errorCallback(FileError.PATH_EXISTS_ERR);
                    } else {
                        errorCallback(FileError.NOT_FOUND_ERR);
                    }
                } else {
                    errorCallback(error.code);
                }
            });
        }, function(error) {
            errorCallback(error.code);
        });
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "async"};
    },

    /* FileReader */
    readAsText: function(args, successCallback, errorCallback) {
        var uri = args[0],
            encoding = args[1];

        nativeResolveLocalFileSystemURI(uri, function(entry) {
            var onLoadEnd = function(evt) {
                    if (!evt.target.error) {
                        successCallback(evt.target.result);
                    }
            },
                onError = function(evt) {
                    errorCallback(evt.target.error.code);
            };

            var reader = new NativeFileReader();

            reader.onloadend = onLoadEnd;
            reader.onerror = onError;
            entry.file(function(file) {
                reader.readAsText(file, encoding);
            }, function(error) {
                errorCallback(error.code);
            });
        }, function(error) {
            errorCallback(error.code);
        });
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "async"};
    },

    readAsDataURL: function(args, successCallback, errorCallback) {
        var uri = args[0];

        nativeResolveLocalFileSystemURI(uri, function(entry) {
            var onLoadEnd = function(evt) {
                    if (!evt.target.error) {
                        successCallback(evt.target.result);
                    }
            },
                onError = function(evt) {
                    errorCallback(evt.target.error.code);
            };

            var reader = new NativeFileReader();

            reader.onloadend = onLoadEnd;
            reader.onerror = onError;
            entry.file(function(file) {
                reader.readAsDataURL(file);
            }, function(error) {
                errorCallback(error.code);
            });
        }, function(error) {
            errorCallback(error.code);
        });
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "async"};
    },

    /* FileWriter */
    write: function(args, successCallback, errorCallback) {
        var uri = args[0],
            text = args[1],
            position = args[2];

        nativeResolveLocalFileSystemURI(uri, function(entry) {
            var onWriteEnd = function(evt) {
                    if(!evt.target.error) {
                        successCallback(evt.target.position - position);
                    } else {
                        errorCallback(evt.target.error.code);
                    }
            },
                onError = function(evt) {
                    errorCallback(evt.target.error.code);
            };

            entry.createWriter(function(writer) {
                writer.onwriteend = onWriteEnd;
                writer.onerror = onError;

                writer.seek(position);
                writer.write(new Blob([text], {type: "text/plain"}));
            }, function(error) {
                errorCallback(error.code);
            });
        }, function(error) {
            errorCallback(error.code);
        });
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "async"};
    },

    truncate: function(args, successCallback, errorCallback) {
        var uri = args[0],
            size = args[1];

        nativeResolveLocalFileSystemURI(uri, function(entry) {
            var onWriteEnd = function(evt) {
                    if(!evt.target.error) {
                        successCallback(evt.target.length);
                    } else {
                        errorCallback(evt.target.error.code);
                    }
            },
                onError = function(evt) {
                    errorCallback(evt.target.error.code);
            };

            entry.createWriter(function(writer) {
                writer.onwriteend = onWriteEnd;
                writer.onerror = onError;

                writer.truncate(size);
            }, function(error) {
                errorCallback(error.code);
            });
        }, function(error) {
            errorCallback(error.code);
        });
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "async"};
    }
};
