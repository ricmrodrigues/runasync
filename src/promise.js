var Promise = (function () {
    function Promise() {
        var self = this,
            _callback = [],
            _continuation = null,
            _complete = false,
            _resolvedData = null;

        this._resolve = function (data) {
            _complete = true;
            _resolvedData = data || _resolvedData;

            //invoke callbacks specified in then
            while (_callback.length) {
                _callback.shift().apply(null, [_resolvedData]);
            }

            if (_continuation) {
                _continuation.apply(null, [_resolvedData]);
                _continuation = null;
            }

            //allowing multiple continuations ?
            //var cont = [],
            //    previousData = null;

            //for (var i = _continuation.length - 1; i >= 0; i--) {
            //    if (i === _continuation.length - 1) {
            //        cont.push(_continuation.shift().apply(null, [_resolvedData]));
            //    }
            //    else { //data is not  being propagated well here, expose the _resolvedData as public result to use it here from the previous task? Like this.result = function() { return _resolvedData; };
            //        cont.slice(-1).continueWith(function () { _continuation.shift().apply(null, [cont.slice(-1).result()]) });
            //    }
            //}
        };
        this.then = function (callback) {
            if (!callback || typeof (callback) !== typeof (Function)) {
                throw "callback must be a function";
            }
            _callback.push(callback);
            if (_complete) {
                self._resolve();
            }

            return this;
        }
        this.continueWith = function (continuation) {
            if (!continuation || typeof (continuation) !== typeof (Function)) {
                throw "continuation must be a function";
            }

            var promise = new Promise();

            _continuation = function () {
                Task.run(continuation).then(function (val) {
                    promise._resolve(val);
                });
            }

            return promise;
        };
    }

    return Promise;
})();