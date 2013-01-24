test("assert returned function is a promise", function() {
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
	
     ok( typeof(promise) === "function" , "Passed!" );
	 ok( typeof(promise.continueWith) === "function" , "Passed!" );
});

QUnit.start();