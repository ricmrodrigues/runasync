/*
 * RunAsync v0.2
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
    		_callback = [],
    		_complete = false,
    		_resolvedData = null;
    	
    	this._resolve = function (data) {    	
    		_complete = true;
    		_resolvedData = data || _resolvedData;    		
    		if (_callback.length) { 
    			for (var i=0; i<_callback.length; i++) {
    				_callback[i].apply(null, [_resolvedData]);
    			}    			
    		}
    	};    	    	
    	this.continueWith = function(callback) {
    		if (!callback || typeof(callback) !== typeof(Function)) {
    			throw "callback must be a function"
    		}
    		_callback.push(callback);
    		if (_complete) {
    			self._resolve();
    		}
    		
    		return this;
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
			    promise._resolve(e.data);
			};
			worker.postMessage(params); // Start the worker.    
			return promise;
		}
    };    	
})();
