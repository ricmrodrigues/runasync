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

    return {
    	Run: function(task, params) {
			var blob = null,
			    promise = $.Deferred(),
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
		};
    };    	
})();
