QUnit.config.autostart = false;
test("assert that Task.run returns a valid promise instance", function() {
	expect(3);
	
    var promise = Task.run(function() {                
            var idx = 0,
			    response = 0,
                max = (89000000*(idx*3));

            for (var i=0;i<max;i++) {
                i++;
                if (i === max - 1) response = i;        
            }
            return response;
        });	
	
	 ok(typeof (promise) === typeof (Object.prototype), "Passed!");
     ok(typeof (promise.when) === typeof (Function), "Passed!");
     ok(typeof (promise.continueWith) === typeof (Function), "Passed!");
});
asyncTest("assert within Task.run we can dispatch something to the UI thread", function () {
    expect(1);

    var promise = Task.run(function () {
        dispatch(function () {
            ok(document !== null && document !== undefined, "document must be available if we're in the UI thread");

            start();
        });
    });
});
QUnit.start();