RunAsync v0.3.0 [![Build Status](https://travis-ci.org/ricmrodrigues/runasync.png?branch=master)](https://travis-ci.org/ricmrodrigues/runasync)  
===============
Library that allows you to execute JavaScript asynchronously seamlessly using modern browser capabitilies
with a syntax resembling .NET's Task Parallel Library.

Usage:
======

__Task__:
```javascript
Task.run(function([parameters]) { } [, Array parameters]) returns Promise
```

__Dispatch execution to the UI thread (from within a Task.run function)__:
```javascript
dispatch(function() {})
```

__Promise__:
```javascript
continueWith(function([parameters]) { }) returns Promise
```

```javascript
for (var x=1;x<=3;x++) {
	(function(idx) {
		Task.run(function(idx) {                
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
		}, [idx]).continueWith(function(value) {
		    console.log("my async code #"+idx+" completed!!");
		    console.log("output: " + value);
		}).continueWith(function(value) {
		    console.log("my async code #"+idx+" completed 2!!");
		    console.log("output 2: " + value);
		});		
	})(x);
}
```

http://jsfiddle.net/v7m5p/8/
