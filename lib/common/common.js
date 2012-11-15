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

module.exports = {
    defaults: {
        cordova: {
            path: 'cordova',
            children: {
                exec: {
                    path: 'cordova/exec'
                },
                logger: {
                    path: 'cordova/plugin/logger'
                }
            }
        },
        Cordova: {
            children: {
                exec: {
                    path: 'cordova/exec'
                }
            }
        },
        navigator: {
            children: {
                notification: {
                    path: 'cordova/plugin/notification'
                },
                accelerometer: {
                    path: 'cordova/plugin/accelerometer'
                },
                battery: {
                    path: 'cordova/plugin/battery'
                },
                camera:{
                    path: 'cordova/plugin/Camera'
                },
                compass:{
                    path: 'cordova/plugin/compass'
                },
                contacts: {
                    path: 'cordova/plugin/contacts'
                },
                device:{
                    children:{
                        capture: {
                            path: 'cordova/plugin/capture'
                        }
                    }
                },
                geolocation: {
                    path: 'cordova/plugin/geolocation'
                },
                globalization: {
                    path: 'cordova/plugin/globalization'
                },
                network: {
                    children: {
                        connection: {
                            path: 'cordova/plugin/network',
                            deprecated: 'navigator.network.connection is deprecated. Use navigator.connection instead.'
                        }
                    }
                },
                splashscreen: {
                    path: 'cordova/plugin/splashscreen'
                }
            }
        },
        Acceleration: {
            path: 'cordova/plugin/Acceleration'
        },
        Camera:{
            path: 'cordova/plugin/CameraConstants'
        },
        CameraPopoverOptions: {
            path: 'cordova/plugin/CameraPopoverOptions'
        },
        CaptureError: {
            path: 'cordova/plugin/CaptureError'
        },
        CaptureAudioOptions:{
            path: 'cordova/plugin/CaptureAudioOptions'
        },
        CaptureImageOptions: {
            path: 'cordova/plugin/CaptureImageOptions'
        },
        CaptureVideoOptions: {
            path: 'cordova/plugin/CaptureVideoOptions'
        },
        CompassHeading:{
            path: 'cordova/plugin/CompassHeading'
        },
        CompassError:{
            path: 'cordova/plugin/CompassError'
        },
        ConfigurationData: {
            path: 'cordova/plugin/ConfigurationData'
        },
        Connection: {
            path: 'cordova/plugin/Connection'
        },
        Contact: {
            path: 'cordova/plugin/Contact'
        },
        ContactAddress: {
            path: 'cordova/plugin/ContactAddress'
        },
        ContactError: {
            path: 'cordova/plugin/ContactError'
        },
        ContactField: {
            path: 'cordova/plugin/ContactField'
        },
        ContactFindOptions: {
            path: 'cordova/plugin/ContactFindOptions'
        },
        ContactName: {
            path: 'cordova/plugin/ContactName'
        },
        ContactOrganization: {
            path: 'cordova/plugin/ContactOrganization'
        },
        Coordinates: {
            path: 'cordova/plugin/Coordinates'
        },
        device: {
            path: 'cordova/plugin/device'
        },
        DirectoryEntry: {
            path: 'cordova/plugin/DirectoryEntry'
        },
        DirectoryReader: {
            path: 'cordova/plugin/DirectoryReader'
        },
        Entry: {
            path: 'cordova/plugin/Entry'
        },
        File: {
            path: 'cordova/plugin/File'
        },
        FileEntry: {
            path: 'cordova/plugin/FileEntry'
        },
        FileError: {
            path: 'cordova/plugin/FileError'
        },
        FileReader: {
            path: 'cordova/plugin/FileReader'
        },
        FileSystem: {
            path: 'cordova/plugin/FileSystem'
        },
        FileTransfer: {
            path: 'cordova/plugin/FileTransfer'
        },
        FileTransferError: {
            path: 'cordova/plugin/FileTransferError'
        },
        FileUploadOptions: {
            path: 'cordova/plugin/FileUploadOptions'
        },
        FileUploadResult: {
            path: 'cordova/plugin/FileUploadResult'
        },
        FileWriter: {
            path: 'cordova/plugin/FileWriter'
        },
        Flags: {
            path: 'cordova/plugin/Flags'
        },
        GlobalizationError: {
            path: 'cordova/plugin/GlobalizationError'
        },
        LocalFileSystem: {
            path: 'cordova/plugin/LocalFileSystem'
        },
        Media: {
            path: 'cordova/plugin/Media'
        },
        MediaError: {
            path: 'cordova/plugin/MediaError'
        },
        MediaFile: {
            path: 'cordova/plugin/MediaFile'
        },
        MediaFileData:{
            path: 'cordova/plugin/MediaFileData'
        },
        Metadata:{
            path: 'cordova/plugin/Metadata'
        },
        Position: {
            path: 'cordova/plugin/Position'
        },
        PositionError: {
            path: 'cordova/plugin/PositionError'
        },
        ProgressEvent: {
            path: 'cordova/plugin/ProgressEvent'
        },
        requestFileSystem:{
            path: 'cordova/plugin/requestFileSystem'
        },
        resolveLocalFileSystemURI:{
            path: 'cordova/plugin/resolveLocalFileSystemURI'
        }
    },
    clobbers: {
        navigator: {
            children: {
                connection: {
                    path: 'cordova/plugin/network'
                }
            }
        }
    }
};
