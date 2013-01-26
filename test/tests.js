QUnit.test("assert returned function is a promise", function() {
	expect(2);
	
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
	
	 console.log(typeof(promise));
	
     ok( typeof(promise) === typeof(Object.prototype) , "Passed!" );
	 ok( typeof(promise.continueWith) === typeof(Function) , "Passed!" );
});
QUnit.start();