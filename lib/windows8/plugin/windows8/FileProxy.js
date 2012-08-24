var cordova = require('cordova'),
	FileError = require('fileError'),
	Flags = requrie('flags');


module.exports = { //Merges with common

    getFileMetaData:function(win,fail,args) {
		// this.fullPath

        Windows.Storage.StorageFile.getFileFromPathAsync(this.fullPath).done(
			function (storageFile) {
				storageFile.getBasicPropertiesAsync().then(
					function (basicProperties) {
						win(new File(storageFile.name, storageFile.path, storageFile.fileType, basicProperties.dateModified, basicProperties.size));
					}, function () {
						fail(FileError.NOT_READABLE_ERR);
					}
				)
			}, function () {
				fail(FileError.NOT_FOUND_ERR)
			}
    	)
    },

    getMetadata:function(win,fail,args) {
		// this.fullPath
		// this.isDirectory
		// this.isFile

        if (this.isFile) {
			Windows.Storage.StorageFile.getFileFromPathAsync(this.fullPath).done(
				function (storageFile) {
					storageFile.getBasicPropertiesAsync().then(
						function (basicProperties) {
							success(basicProperties.dateModified);
						},
		                function () {
							fail(FileError.NOT_READABLE_ERR);
		                }
					)
				},
		        function () {
					fail(FileError.NOT_READABLE_ERR);
		        }
		    )
		}

		if (this.isDirectory) {
			Windows.Storage.StorageFolder.getFolderFromPathAsync(this.fullPath).done(
				function (storageFolder) {
					storageFolder.getBasicPropertiesAsync().then(
						function (basicProperties) {
							success(basicProperties.dateModified);
						},
						function () {
							fail(FileError.NOT_FOUND_ERR);
						}
					);
				},
				function () {
					fail(FileError.NOT_READABLE_ERR);
				}
			)
		}
    },

    getParent:function(win,fail,args) { // ["fullPath"]
        var fullPath = args[0];

        // code requires Promise
    },

    readAsText:function(win,fail,args) {
        // this.fileName
        // this.encoding

        Windows.Storage.StorageFile.getFileFromPathAsync(this.fileName).done(
			function (storageFile) {
				var value = Windows.Storage.Streams.UnicodeEncoding.utf8;
		        if (enc == 'Utf16LE' || enc == 'utf16LE') {
		            value = Windows.Storage.Streams.UnicodeEncoding.utf16LE;
		        }else if (enc == 'Utf16BE' || enc == 'utf16BE') {
		            value = Windows.Storage.Streams.UnicodeEncoding.utf16BE;
		        }
		        Windows.Storage.FileIO.readTextAsync(storageFile, value).done(
					function (fileContent) {
						win(fileContent);
		        	},
		        	function () {
						fail(FileError.ENCODING_ERR)
					}
				);
    		}, function () {
				fail(FileError.NOT_FOUND_ERR)
			}
		)
    },

    readAsDataURL:function(win,fail,args) {
    	// this.fileName

        Windows.Storage.StorageFile.getFileFromPathAsync(this.fileName).then(
			function (storageFile) {
		        Windows.Storage.FileIO.readBufferAsync(storageFile).done(
					function (buffer) {
		            	var strBase64 = Windows.Security.Cryptography.CryptographicBuffer.encodeToBase64String(buffer);
		            	//the method encodeToBase64String will add "77u/" as a prefix, so we should remove it
		            	if(String(strBase64).substr(0,4) == "77u/") {
		                	strBase64 = strBase64.substr(4);
		            	}
		            	var mediaType = storageFile.contentType;
		            	var result = "data:" + mediaType + ";base64," + strBase64;
						win(result);
		        	}
				)
			}, function () {
				fail(FileError.NOT_FOUND_ERR)
			}
		)
    },

    getDirectory:function(win,fail,args) {
        // this.fullPath
        // path
        // options

        var flag = "";
		if (options != null) {
			flag = new Flags(options.create, options.exclusive);
		} else {
			flag = new Flags(false, false);
		};

		path = String(path).split(" ").join("\ ");

		Windows.Storage.StorageFolder.getFolderFromPathAsync(this.fullPath).then(
			function (storageFolder) {
				if (flag.create == true && flag.exclusive == true) {
					storageFolder.createFolderAsync(path, Windows.Storage.CreationCollisionOption.failIfExists).done(
						function (storageFolder) {
							win(new DirectoryEntry(storageFolder.name, storageFolder.path))
						}, function () {
							fail(FileError.PATH_EXISTS_ERR);
						}
					)
				} else if (flag.create == true && flag.exclusive == false) {
					storageFolder.createFolderAsync(path, Windows.Storage.CreationCollisionOption.openIfExists).done(
						function (storageFolder) {
							win(new DirectoryEntry(storageFolder.name, storageFolder.path))
						}, function () {
							fail(FileError.INVALID_MODIFICATION_ERR);
						}
					)
				} else if (flag.create == false) {
					if (/\?|\\|\*|\||\"|<|>|\:|\//g.test(path)) {
						fail(FileError.ENCODING_ERR);
						return;
					};

					storageFolder.getFolderAsync(path).done(
						function (storageFolder) {
							win(new DirectoryEntry(storageFolder.name, storageFolder.path))
						}, function () {
							fail(FileError.NOT_FOUND_ERR);
						}
					)
				}
			}, function () {
				fail(FileError.NOT_FOUND_ERR)
			}
		)
    },

    remove:function(win,fail,args) {
        // this.fullPath
        // this.isDirectory
        // this.isFile

        // code requires Promise

    },

    removeRecursively:function(win,fail,args) { // ["fullPath"]
        var fullPath = args[0];

        // code requires Promise
    },

    getFile:function(win,fail,args) {
        // this.fullPath
		// path
        // options

        var flag = "";
		if (options != null) {
			flag = new Flags(options.create, options.exclusive);
		} else {
			flag = new Flags(false, false);
    	}

    	path = String(path).split(" ").join("\ ");

    	Windows.Storage.StorageFolder.getFolderFromPathAsync(this.fullPath).then(
			function (storageFolder) {
		        if (flag.create == true && flag.exclusive == true) {
		            storageFolder.createFileAsync(path, Windows.Storage.CreationCollisionOption.failIfExists).done(
						function (storageFile) {
		                	win(new FileEntry(storageFile.name, storageFile.path))
		            	}, function () {
							fail(FileError.PATH_EXISTS_ERR);
		            	}
		            )
		        } else if (flag.create == true && flag.exclusive == false) {
		            storageFolder.createFileAsync(path, Windows.Storage.CreationCollisionOption.openIfExists).done(
						function (storageFile) {
		                	win(new FileEntry(storageFile.name, storageFile.path))
		            	}, function () {
							fail(FileError.INVALID_MODIFICATION_ERR);
		            	}
					)
		        } else if (flag.create == false) {
		            if (/\?|\\|\*|\||\"|<|>|\:|\//g.test(path)) {
		                fail(FileError.ENCODING_ERR);
		                return;
		            };
		            storageFolder.getFileAsync(path).done(
						function (storageFile) {
		                	win(new FileEntry(storageFile.name, storageFile.path))
		            	}, function () {
		                	fail(FileError.NOT_FOUND_ERR);
		            	}
					)
		        }
		    }, function () {
		        fail(FileError.NOT_FOUND_ERR)
    		}
    	)
    },

    readEntries:function(win,fail,args) { // ["fullPath"]
        var fullPath = args[0];

        // code requires Promise
    },

    write:function(win,fail,args) {
        // this.fileName
        // text
        // this.position

        Windows.Storage.StorageFile.getFileFromPathAsync(this.fileName).done(
			function (storageFile) {
				Windows.Storage.FileIO.writeTextAsync(storageFile,text,Windows.Storage.Streams.UnicodeEncoding.utf8).done(
					function() {
						win(String(text).length);
					}, function () {
						fail(FileError.INVALID_MODIFICATION_ERR);
					}
				);
			}, function() {
				fail(FileError.NOT_FOUND_ERR)
			}
		)
    },

    truncate:function(win,fail,args) { // ["fileName","size"]
        var fileName = args[0];
        var size = args[1];

        // code requires Promise
    },

    copyTo:function(win,fail,args) { // ["fullPath","parent", "newName"]
        var fullPath = args[0];
        var parent = args[1];
        var newName = args[2];

        // code requires Promise
    },

    moveTo:function(win,fail,args) { // ["fullPath","parent", "newName"]
        var fullPath = args[0];
        var parent = args[1];
        var newName = args[2];

        // code requires Promise
    },

    tempFileSystem:null,
    persistentFileSystem:null,
    requestFileSystem:function(win,fail,args) {
		// type
		// size

		var filePath = "";
		var result = null;
		var fsTypeName = "";

		switch (type) {
			case LocalFileSystem.TEMPORARY:
				filePath = FileSystemTemproraryRoot;
				fsTypeName = "temporary";
				break;
			case LocalFileSystem.PERSISTENT:
				filePath = FileSystemPersistentRoot;
				fsTypeName = "persistent";
				break;
		}

		var MAX_SIZE = 10000000000;
		if (size > MAX_SIZE) {
			fail(FileError.QUOTA_EXCEEDED_ERR);
			return;
		}

		var fileSystem = new FileSystem(fsTypeName, new DirectoryEntry(fsTypeName, filePath));
		result = fileSystem;
    	win(result);
    },

    resolveLocalFileSystemURI:function(win,fail,args) {
		// uri

		var path = uri;
		path = path.split(" ").join("\ ");

		// support for file name with parameters
		if (/\?/g.test(path)) {
			path = String(path).split("\?")[0];
		};

		// support for encodeURI
		if (/\%5/g.test(path)) {
			path = decodeURI(path);
		};

		// support for special path start with file:///
		if (path.substr(0, 8) == "file:///") {
			path = FileSystemPersistentRoot + "\\" + String(path).substr(8).split("/").join("\\");
			Windows.Storage.StorageFile.getFileFromPathAsync(path).then(
				function (storageFile) {
					success(new FileEntry(storageFile.name, storageFile.path));
				}, function () {
					Windows.Storage.StorageFolder.getFolderFromPathAsync(path).then(
						function (storageFolder) {
							success(new DirectoryEntry(storageFolder.name, storageFolder.path));
						}, function () {
							fail(FileError.NOT_FOUND_ERR);
						}
					)
				}
			)
		} else {
			Windows.Storage.StorageFile.getFileFromPathAsync(path).then(
				function (storageFile) {
					success(new FileEntry(storageFile.name, storageFile.path));
				}, function () {
					Windows.Storage.StorageFolder.getFolderFromPathAsync(path).then(
						function (storageFolder) {
							success(new DirectoryEntry(storageFolder.name, storageFolder.path));
						}, function () {
							fail(FileError.ENCODING_ERR);
						}
					)
				}
			)
    	}
    }

};