/*global WebKitBlobBuilder:false */
var FileError = require('cordova/plugin/FileError'),
    DirectoryEntry = require('cordova/plugin/DirectoryEntry'),
    FileEntry = require('cordova/plugin/FileEntry'),
    File = require('cordova/plugin/File'),
    FileSystem = require('cordova/plugin/FileSystem');

var nativeRequestFileSystem = window.webkitRequestFileSystem,
    nativeResolveLocalFileSystemURI = window.webkitResolveLocalFileSystemURL,
    NativeFileReader = window.FileReader;

function getFileSystemName(nativeFs) {
    return (nativeFs.name.indexOf("Persistent") != -1) ? "persistent" : "temporary";
}

function makeEntry(entry) {
    if (entry.isDirectory) {
        return new DirectoryEntry(entry.name, decodeURI(entry.toURL()));
    }
    else {
        return new FileEntry(entry.name, decodeURI(entry.toURL()));
    }
}

module.exports = {
    /* requestFileSystem */
    requestFileSystem: function(successCallback, errorCallback, args) {
        var type = args[0],
            size = args[1];

        nativeRequestFileSystem(type, size, function(nativeFs) {
            successCallback(new FileSystem(getFileSystemName(nativeFs), makeEntry(nativeFs.root)));
        }, function(error) {
            errorCallback(error.code);
        });
    },

    /* resolveLocalFileSystemURI */
    resolveLocalFileSystemURI: function(successCallback, errorCallback, args) {
        var uri = args[0];

        nativeResolveLocalFileSystemURI(uri, function(entry) {
            successCallback(makeEntry(entry));
        }, function(error) {
            errorCallback(error.code);
        });
    },

    /* DirectoryReader */
    readEntries: function(successCallback, errorCallback, args) {
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
    },

    /* Entry */
    getMetadata: function(successCallback, errorCallback, args) {
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
    },

    moveTo: function(successCallback, errorCallback, args) {
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
    },

    copyTo: function(successCallback, errorCallback, args) {
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
    },

    remove: function(successCallback, errorCallback, args) {
        var uri = args[0];

        nativeResolveLocalFileSystemURI(uri, function(entry) {
            if (entry.fullPath === "/") {
                errorCallback(FileError.NO_MODIFICATION_ALLOWED_ERR);
            } else {
                entry.remove(successCallback, function(error) {
                    errorCallback(error.code);
                });
            }
        }, function(error) {
            errorCallback(error.code);
        });
    },

    getParent: function(successCallback, errorCallback, args) {
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
    },

    /* FileEntry */
    getFileMetadata: function(successCallback, errorCallback, args) {
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
    },

    /* DirectoryEntry */
    getDirectory: function(successCallback, errorCallback, args) {
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
    },

    removeRecursively: function(successCallback, errorCallback, args) {
        var uri = args[0];

        nativeResolveLocalFileSystemURI(uri, function(entry) {
            if (entry.fullPath === "/") {
                errorCallback(FileError.NO_MODIFICATION_ALLOWED_ERR);
            } else {
                entry.removeRecursively(successCallback, function(error) {
                    errorCallback(error.code);
                });
            }
        }, function(error) {
            errorCallback(error.code);
        });
    },

    getFile: function(successCallback, errorCallback, args) {
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
                        errorCallback(FileError.ENCODING_ERR);
                    }
                } else {
                    errorCallback(error.code);
                }
            });
        }, function(error) {
            errorCallback(error.code);
        });
    },

    /* FileReader */
    readAsText: function(successCallback, errorCallback, args) {
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
    },

    readAsDataURL: function(successCallback, errorCallback, args) {
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
    },

    /* FileWriter */
    write: function(successCallback, errorCallback, args) {
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
                var blob = new WebKitBlobBuilder();
                blob.append(text);

                writer.onwriteend = onWriteEnd;
                writer.onerror = onError;

                writer.seek(position);
                writer.write(blob.getBlob('text/plain'));
            }, function(error) {
                errorCallback(error.code);
            });
        }, function(error) {
            errorCallback(error.code);
        });
    },

    truncate: function(successCallback, errorCallback, args) {
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
    }
};
