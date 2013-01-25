/*
 * RunAsync v0.3.0 - 2013-01-25
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

            //invoke callbacks specified in then
            while (_callback.length) {
                _callback.shift().apply(null, [_resolvedData]);
            }

            if (_continuation) {
                _continuation.apply(null, [_resolvedData]);
                _continuation = null;
            }

            //allowing multiple continuations ?
            //var cont = [],
            //    previousData = null;

            //for (var i = _continuation.length - 1; i >= 0; i--) {
            //    if (i === _continuation.length - 1) {
            //        cont.push(_continuation.shift().apply(null, [_resolvedData]));
            //    }
            //    else { //data is not  being propagated well here, expose the _resolvedData as public result to use it here from the previous task? Like this.result = function() { return _resolvedData; };
            //        cont.slice(-1).continueWith(function () { _continuation.shift().apply(null, [cont.slice(-1).result()]) });
            //    }
            //}
        };
        this.then = function (callback) {
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

            _continuation = function () {
                Task.run(continuation).then(function (val) {
                    promise._resolve(val);
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
        throw "this browser does not support Task.Run";
    }

    return {
        run: function (task, params) {
            var blob = null,
                promise = new Promise(),
                dispatcher = "var dispatch = function(func) { postMessage({ done: false, result: func.toString() }); };",
                finalizer = "postMessage({ done: true, result: taskResult}); }",
                func = "onmessage = function(e) { " + dispatcher + " var taskResult = (" + task.toString() + ")(e.data); " + finalizer;

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
                if (e.data.done) {
                    //worker finished, resolve promise with result
                    promise._resolve(e.data.result);
                } else {
                    //worker dispatched something to the UI thread
                    eval("(" + e.data.result + ")()");
                }
            };
            worker.postMessage(params); // Start the worker.    
            return promise;
        }
    };
})(Promise);
