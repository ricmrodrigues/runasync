Usage:

```javascript
(Promise) Task.run(function([parameters]) { } [, Array parameters]);
```

```javascript
Promise:
 (Promise) continueWith(function([parameters]) { })
```

```javascript
for (var x=1;x<=3;x++) {
	(function(idx) {
		Task.run(function(idx) {                
		    var response = 0,
		        max = (89000000*(idx*3));
		    
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

http://jsfiddle.net/v7m5p/2/
