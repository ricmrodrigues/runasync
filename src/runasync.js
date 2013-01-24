/*
 * RunAsync v0.2.0
 * http://github.com/ricmrodrigues/runasync
 *
 * Library that allows you to execute JavaScript asynchronously
 * seamlessly using modern browser capabilities
 *
 * Copyright 2013 @ricmrodrigues
 * Released under the MIT license
 * http://mit-license.org/
 *
 */
var Task = (function (Promise) {
    "use strict";
    var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder,
        url = window.URL || window.webkitURL;

    if (!BlobBuilder && !Blob) {
        throw "this browser does not support Task.Run";
    }

    return {
        run: function (task, params) {
            var blob = null,
                promise = new Promise(),
                func = "onmessage = function(e) { var taskResult = (" + task.toString() + ")(e.data); postMessage(taskResult); }";

            if (Blob) {
                blob = new Blob([func], {
                    type: 'text/javascript'
                });
            } else {
                var bb = new BlobBuilder();
                bb.append(func);
                blob = bb.getBlob("text/javascript");
            }

            var blobUrl = url.createObjectURL(blob),
                worker = new Worker(blobUrl);
            worker.onmessage = function (e) {
                promise._resolve(e.data);
            };
            worker.postMessage(params); // Start the worker.    
            return promise;
        }
    };
})(Promise);
