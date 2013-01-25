RunAsync v0.3.1 [![Build Status](https://travis-ci.org/ricmrodrigues/runasync.png?branch=master)](https://travis-ci.org/ricmrodrigues/runasync)  
===============
Library that allows you to execute JavaScript asynchronously seamlessly using modern browser capabitilies
with a syntax resembling .NET's Task Parallel Library.

Usage:
======

__Task__:
```javascript
Task.run(function([parameters]) { } [, Array parameters]) returns Promise
```

__Dispatch execution to the UI thread (from within a Task.run or continueWith function callback)__:
```javascript
dispatch(function() {})
```

__Promise__:
```javascript
//'when' executes in the UI thread, immediately after the background thread finishes
when(function([parameters]) { }) return Promise
//'continueWith' spins up a new task with the callback provided
continueWith(function([parameters]) { }) returns Promise
```

Performance:
============
__Using RunAsync__:
http://jsfiddle.net/v7m5p/12/

__Running code synchronously__:
http://jsfiddle.net/UejYX/3/

Example:
```javascript
for (var x=1;x<=3;x++) {
	(function(idx) {
		var task = Task.run(function(idx) {                
		    var response = 0,
		        max = (89000000*(idx*3));
		    
            dispatch(function() {
                //do some DOM manipulation that gets executed in the UI thread
            });		    
		    
		    for (var i=0;i<max;i++) {
		        i++;
		        if (i === max - 1) response = i;        
		    }
			return response;
		}, [idx]);
		
		task.when(function(value) {
		    console.log("executed from UI thread");
		});
		
		task.continueWith(function(value) {
		    //execute something else asynchronously
		});		
	})(x);
}
```
