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


console.log("TIZEN FILE START");

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
    /* common/equestFileSystem.js, args = [type, size] */
    requestFileSystem: function(successCallback, errorCallback, args) {
        var type = args[0],
            size = args[1];

        nativeRequestFileSystem(
            type,
            size,
            function(nativeFs) {
                successCallback(new FileSystem(getFileSystemName(nativeFs), makeEntry(nativeFs.root)));
            },
            function(error) {
                errorCallback(error.code);
            }
        );
    },

    /* common/resolveLocalFileSystemURI.js, args= [uri] */
    resolveLocalFileSystemURI: function(successCallback, errorCallback, args) {
        var uri = args[0];

        nativeResolveLocalFileSystemURI(
            uri,
            function(entry) {
                successCallback(makeEntry(entry));
            },
            function(error) {
                errorCallback(error.code);
            }
        );
    },

    /* common/DirectoryReader.js, args = [this.path] */
    readEntries: function(successCallback, errorCallback, args) {
        var uri = args[0];

        nativeResolveLocalFileSystemURI(
            uri,
            function(dirEntry) {
                var reader = dirEntry.createReader();

                reader.readEntries(
                    function(entries) {
                        var retVal = [];
                        for (var i = 0; i < entries.length; i++) {
                            retVal.push(makeEntry(entries[i]));
                        }
                        successCallback(retVal);
                    },
                    function(error) {
                        errorCallback(error.code);
                    }
                );
            },
            function(error) {
                errorCallback(error.code);
            }
        );
    },

    /* common/Entry.js , args = [this.fullPath] */
    getMetadata: function(successCallback, errorCallback, args) {
        var uri = args[0];

        nativeResolveLocalFileSystemURI(
            uri,
            function(entry) {
                entry.getMetadata(
                    function(metaData) {
                        successCallback(metaData.modificationTime);
                    },
                    function(error) {
                        errorCallback(error.code);
                    }
                );
            },
            function(error) {
                errorCallback(error.code);
            }
        );
    },

    /* args = [this.fullPath, metadataObject] */
    /* PPL to be implemented */
    setMetadata: function(successCallback, errorCallback, args) {
        var uri = args[0],
            metadata = args[1];

        if (errorCallback) {
            errorCallback(FileError.NOT_FOUND_ERR);
        }
    },


    /* args = [srcPath, parent.fullPath, name] */
    moveTo: function(successCallback, errorCallback, args) {
        var srcUri = args[0],
            parentUri = args[1],
            name = args[2];

        nativeResolveLocalFileSystemURI(
            srcUri,
            function(source) {
                nativeResolveLocalFileSystemURI(
                    parentUri,
                    function(parent) {
                        source.moveTo(
                            parent,
                            name,
                            function(entry) {
                                successCallback(makeEntry(entry));
                            },
                            function(error) {
                                errorCallback(error.code);
                        }
                        );
                    },
                    function(error) {
                        errorCallback(error.code);
                    }
                );
            },
            function(error) {
                errorCallback(error.code);
            }
        );
    },

    /* args = [srcPath, parent.fullPath, name] */
    copyTo: function(successCallback, errorCallback, args) {
        var srcUri = args[0],
            parentUri = args[1],
            name = args[2];

        nativeResolveLocalFileSystemURI(
            srcUri,
            function(source) {
                nativeResolveLocalFileSystemURI(
                    parentUri,
                    function(parent) {
                        source.copyTo(
                            parent,
                            name,
                            function(entry) {
                                successCallback(makeEntry(entry));
                            },
                            function(error) {
                                errorCallback(error.code);
                            }
                        );
                    },
                    function(error) {
                        errorCallback(error.code);
                    }
                );
            },
            function(error) {
                errorCallback(error.code);
            }
        );
    },


    /* args = [this.fullPath] */
    remove: function(successCallback, errorCallback, args) {
        var uri = args[0];

        nativeResolveLocalFileSystemURI(
            uri,
            function(entry) {
                if (entry.fullPath === "/") {
                    errorCallback(FileError.NO_MODIFICATION_ALLOWED_ERR);
                }
                else {
                    entry.remove(
                        successCallback,
                        function(error) {
                            errorCallback(error.code);
                        }
                    );
                }
            },
            function(error) {
                errorCallback(error.code);
            }
        );
    },

    /* args = [this.fullPath] */
    getParent: function(successCallback, errorCallback, args) {
        var uri = args[0];

        nativeResolveLocalFileSystemURI(
            uri,
            function(entry) {
                entry.getParent(
                    function(entry) {
                        successCallback(makeEntry(entry));
                    },
                    function(error) {
                        errorCallback(error.code);
                    }
                );
            },
            function(error) {
                errorCallback(error.code);
            }
        );
    },

    /* common/FileEntry.js, args = [this.fullPath] */
    getFileMetadata: function(successCallback, errorCallback, args) {
        var uri = args[0];

        nativeResolveLocalFileSystemURI(
            uri,
            function(entry) {
                entry.file(
                    function(file) {
                        var retVal = new File(file.name, decodeURI(entry.toURL()), file.type, file.lastModifiedDate, file.size);
                        successCallback(retVal);
                    },
                    function(error) {
                        errorCallback(error.code);
                    }
                );
            },
            function(error) {
                errorCallback(error.code);
            }
        );
    },

    /* common/DirectoryEntry.js , args = [this.fullPath, path, options] */
    getDirectory: function(successCallback, errorCallback, args) {
        var uri = args[0],
            path = args[1],
            options = args[2];

        nativeResolveLocalFileSystemURI(
            uri,
            function(entry) {
                entry.getDirectory(
                    path,
                    options,
                    function(entry) {
                        successCallback(makeEntry(entry));
                    },
                    function(error) {
                        if (error.code === FileError.INVALID_MODIFICATION_ERR) {
                            if (options.create) {
                                errorCallback(FileError.PATH_EXISTS_ERR);
                            }
                            else {
                                errorCallback(FileError.ENCODING_ERR);
                            }
                        }
                        else {
                            errorCallback(error.code);
                        }
                    }
                );
            },
            function(error) {
                errorCallback(error.code);
            }
        );
    },

    /* args = [this.fullPath] */
    removeRecursively: function(successCallback, errorCallback, args) {
        var uri = args[0];

        nativeResolveLocalFileSystemURI(
            uri,
            function(entry) {
                if (entry.fullPath === "/") {
                    errorCallback(FileError.NO_MODIFICATION_ALLOWED_ERR);
                }
                else {
                    entry.removeRecursively(
                        successCallback,
                        function(error) {
                            errorCallback(error.code);
                        }
                    );
                }
            },
            function(error) {
                errorCallback(error.code);
            }
        );
    },

    /* args = [this.fullPath, path, options] */
    getFile: function(successCallback, errorCallback, args) {
        var uri = args[0],
            path = args[1],
            options = args[2];

        nativeResolveLocalFileSystemURI(
            uri,
            function(entry) {
                entry.getFile(
                    path,
                    options,
                    function(entry) {
                        successCallback(makeEntry(entry));
                    },
                    function(error) {
                        if (error.code === FileError.INVALID_MODIFICATION_ERR) {
                            if (options.create) {
                                errorCallback(FileError.PATH_EXISTS_ERR);
                            }
                            else {
                                errorCallback(FileError.ENCODING_ERR);
                            }
                        }
                        else {
                            errorCallback(error.code);
                        }
                    }
                );
            },
            function(error) {
                errorCallback(error.code);
            }
        );
    },

    /* common/FileReader.js, args = execArgs = [filepath, encoding, file.start, file.end] */
    readAsText: function(successCallback, errorCallback, args) {
        var uri = args[0],
            encoding = args[1];

        nativeResolveLocalFileSystemURI(
            uri,
            function(entry) {
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

                entry.file(
                    function(file) {
                        reader.readAsText(file, encoding);
                    },
                    function(error) {
                        errorCallback(error.code);
                    }
                );
            },
            function(error) {
                errorCallback(error.code);
            }
        );
    },

    /* args = execArgs = [this._fileName, file.start, file.end] */
    readAsDataURL: function(successCallback, errorCallback, args) {
        var uri = args[0];

        nativeResolveLocalFileSystemURI(
            uri,
            function(entry) {
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
                entry.file(
                    function(file) {
                        reader.readAsDataURL(file);
                    },
                    function(error) {
                        errorCallback(error.code);
                    }
                );
            },
            function(error) {
                errorCallback(error.code);
            }
        );
    },

    /* args = execArgs =  [this._fileName, file.start, file.end] */
    /* PPL, to Be implemented , for now it is pasted from readAsText...*/
    readAsBinaryString: function(successCallback, errorCallback, args) {
        var uri = args[0];

        nativeResolveLocalFileSystemURI(
            uri,
            function(entry) {
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

                entry.file(
                    function(file) {
                        reader.readAsDataURL(file);
                    },
                    function(error) {
                        errorCallback(error.code);
                    }
                );
            },
            function(error) {
                errorCallback(error.code);
            }
        );
    },


    /* args = execArgs =  [this._fileName, file.start, file.end] */
    /* PPL, to Be implemented , for now it is pasted from readAsText...*/
    readAsArrayBuffer: function(successCallback, errorCallback, args) {
        var uri = args[0];

        nativeResolveLocalFileSystemURI(
            uri,
            function(entry) {
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

                entry.file(
                    function(file) {
                        reader.readAsDataURL(file);
                    },
                    function(error) {
                        errorCallback(error.code);
                    }
                );
            },
            function(error) {
                errorCallback(error.code);
            }
        );
    },

    /* common/FileWriter.js, args = [this.fileName, text, this.position] */
    write: function(successCallback, errorCallback, args) {
        var uri = args[0],
            text = args[1],
            position = args[2];

        nativeResolveLocalFileSystemURI(
            uri,
            function(entry) {
                var onWriteEnd = function(evt) {
                        if(!evt.target.error) {
                            successCallback(evt.target.position - position);
                        }
                        else {
                            errorCallback(evt.target.error.code);
                        }
                    },
                    onError = function(evt) {
                        errorCallback(evt.target.error.code);
                    };

                entry.createWriter(
                    function(writer) {
                        var blob = new WebKitBlobBuilder();
                        blob.append(text);

                        writer.onwriteend = onWriteEnd;
                        writer.onerror = onError;

                        writer.seek(position);
                        writer.write(blob.getBlob('text/plain'));
                    },
                    function(error) {
                        errorCallback(error.code);
                    }
                );
            },
            function(error) {
                errorCallback(error.code);
            }
        );
    },

    /* args = [this.fileName, size] */
    truncate: function(successCallback, errorCallback, args) {
        var uri = args[0],
            size = args[1];

        nativeResolveLocalFileSystemURI(
            uri,
            function(entry) {
                var onWriteEnd = function(evt) {
                        if(!evt.target.error) {
                            successCallback(evt.target.length);
                        }
                        else {
                            errorCallback(evt.target.error.code);
                        }
                    },
                    onError = function(evt) {
                        errorCallback(evt.target.error.code);
                    };

                entry.createWriter(
                    function(writer) {
                        writer.onwriteend = onWriteEnd;
                        writer.onerror = onError;
                        writer.truncate(size);
                    },
                    function(error) {
                        errorCallback(error.code);
                    }
                );
            },
            function(error) {
                errorCallback(error.code);
            }
        );
    }
};


console.log("TIZEN FILE END");

