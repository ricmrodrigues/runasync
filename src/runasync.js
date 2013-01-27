/*
 * RunAsync v0.3.0
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
        throw "this browser does not support RunAsync";
    }

    return {
        run: function (task, params) {
            var blob = null,
                promise = new Promise();

            var dispatcher = function (func, params) {
                    postMessage({ done: false, result: func.toString(), params: params });
                },
                finalizer = function (taskResult) {
                    postMessage({ done: true, result: taskResult});
                },
                func = "onmessage = function(e) { var dispatch = " + dispatcher.toString() + "; var taskResult = (" + task.toString() + ").apply(null, e.data); var finalizer = (" + finalizer.toString() + ")(taskResult); }";

            if (typeof(Blob) === typeof(Function)) {
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
                if (e.data.done) {
                    //worker finished, resolve promise with result
                    promise._resolve(e.data.result);
                } else {
                    //worker dispatched something to the UI thread
                    eval("(" + e.data.result + ").apply(null, " + JSON.stringify(e.data.params) + ");");
                }
            };
            worker.postMessage(params); // Start the worker.    
            return promise;
        }
    };
})(Promise);
