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
        };
        this.result = function () {
            return _resolvedData;
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
        };
        this.continueWith = function (continuation) {
            if (!continuation || typeof (continuation) !== typeof (Function)) {
                throw "continuation must be a function";
            }

            var promise = new Promise();
            _continuation = function (result) {
                Task.run(continuation, [result]).then(function (result) {
                    promise._resolve(result);
                });
            };

            return promise;
        };
    }

    return Promise;
})();