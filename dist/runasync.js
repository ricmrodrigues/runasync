/*
 * RunAsync v0.3.3 - 2013-02-05
 * 
 * Library that allows you to execute JavaScript asynchronously
 * seamlessly using modern browser capabilities
 * 
 * https://github.com/ricmrodrigues/runasync
 * Copyright (c) 2013 @ricmrodrigues
 * Licensed MIT
 */

var Promise = (function () {
    function Promise() {
        var self = this,
            _callback = [],
            _continuation = null,
            _complete = false,
            _resolvedData = null;

        this._resolve = function (data) {
            _complete = true;
            _resolvedData = data || _resolvedData;

            //invoke callbacks specified in when
            while (_callback.length) {
                _callback.shift().apply(null, [_resolvedData]);
            }

            if (_continuation) {
                _continuation.apply(null, [_resolvedData]);
                _continuation = null;
            }
        };
        this.result = function () {
            return _resolvedData;
        };
        this.when = function (callback) {
            if (!callback || typeof (callback) !== typeof (Function)) {
                throw "callback must be a function";
            }
            _callback.push(callback);
            if (_complete) {
                self._resolve();
            }

            return this;
        };
        this.continueWith = function (continuation) {
            if (!continuation || typeof (continuation) !== typeof (Function)) {
                throw "continuation must be a function";
            }

            var promise = new Promise();
            _continuation = function (result) {
                Task.run(continuation, [result]).when(function (result) {
                    promise._resolve(result);
                });
            };

            return promise;
        };
    }

    return Promise;
})();
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
