/*
 * RunAsync v0.1
 * http://github.com/ricmrodrigues/runasync
 *
 * Library that allows you to execute JavaScript asynchronously
 * seamlessly using modern browser capabitilies
 *
 * Copyright 2013 @ricmrodrigues
 * Released under the MIT license
 * http://mit-license.org/
 *
 */
var Task = (function() {
	"use strict";
	var BlobBuilder = BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder ||
                     window.MozBlobBuilder || window.MSBlobBuilder,
        url = window.URL || window.webkitURL;
    
    if (!BlobBuilder && !Blob) {
        throw "This browser does not support Task.Run";
    }
    
    //TODO: move to different file
    function Promise() {
    	var self = this,
    		_callback = null,
    		_complete = false,
    		_resolvedData = null;
    	
    	var resolve = function (data) {    	
    		_complete = true;
    		_resolvedData = data || _resolvedData;    		
    		if (_callback) {    			    			
    			_callback.apply(null, [_resolvedData]);
    		}
    	};    	
    	
    	this.continueWith = function(callback) {
    		if (!callback || typeof(callback) !== typeof(Function)) {
    			throw "callback must be a function"
    		}
    		_callback = callback;
    		if (_complete) {
    			resolve();
    		}
    	};
    }

    return {
    	run: function(task, params) {
			var blob = null,
			    promise = new Promise(),
			    func = "onmessage = function(e) { var taskResult = ("+task.toString()+")(e.data); postMessage(taskResult); }";     
			
			if (Blob) {
			    blob = new Blob([func], {type: 'text/javascript'});
			}
			else {
			    var bb = new BlobBuilder();
			    bb.append(func);                    
			    blob = bb.getBlob("text/javascript");
			}
			
			var blobUrl = url.createObjectURL(blob),        
				worker = new Worker(blobUrl);
			worker.onmessage = function(e) {
			    promise.resolve(e.data);
			};
			worker.postMessage(params); // Start the worker.    
			return promise;
		}
    };    	
})();
