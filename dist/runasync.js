/*
 * RunAsync v0.2.0 - 2013-01-24
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
            _complete = false,
            _resolvedData = null;
        
        this._resolve = function (data) {
            _complete = true;
            _resolvedData = data || _resolvedData;
            if (_callback.length) {
                for (var i = 0; i < _callback.length; i++) {
                    _callback[i].apply(null, [_resolvedData]);
                }
            }
        };
        this.continueWith = function (callback) {
            if (!callback || typeof (callback) !== typeof (Function)) {
                throw "callback must be a function";
            }
            _callback.push(callback);
            if (_complete) {
                self._resolve();
            }
        
            return this;
        };
	}
	
	return Promise;
})();
var Task = (function (Promise) {
    "use strict";
    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder,
    window.URL = window.URL || window.webkitURL;

    if (!window.BlobBuilder && !window.Blob) {
        throw "this browser does not support Task.Run";
    }

    return {
        run: function (task, params) {
            var blob = null,
                promise = new Promise(),
                func = "onmessage = function(e) { var taskResult = (" + task.toString() + ")(e.data); postMessage(taskResult); }";

            if (window.Blob) {
                blob = new window.Blob([func], {
                    type: 'text/javascript'
                });
            } else {
                var bb = new window.BlobBuilder();
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
