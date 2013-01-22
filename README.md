Usage:

```javascript
(jQuery.Deferred) RunAsync(function([parameters]) { } [, parameters]);
```

```javascript
for (var x=1;x<=3;x++) {
	(function(idx) {
		RunAsync(function(idx) {                
			var response = 0,
				max = (89000000*(idx*3));
			
			for (var i=0;i<max;i++) {
				i++;
				if (i === max - 1) response = i;        
			}
			return response;
		}, [idx]).done(function(value) {
			console.log("my async code #"+idx+" completed!!");
			console.log("output: " + value);
		});
	})(x);
}
```

http://jsfiddle.net/v7m5p/