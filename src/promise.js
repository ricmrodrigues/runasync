var Promise = (function () {
    function Promise() {
        var self = this,
            _callback = [],
            _complete = false,
            _resolvedData = null;
        
        this._resolve = function (data) {
            _complete = true;
            _resolvedData = data || _resolvedData;
            if (_callback.length) {
                for (var i = 0; i < _callback.length; i++) {
                    _callback[i].apply(null, [_resolvedData]);
                }
            }
        };
        this.continueWith = function (callback) {
            if (!callback || typeof (callback) !== typeof (Function)) {
                throw "callback must be a function";
            }
            _callback.push(callback);
            if (_complete) {
                self._resolve();
            }
        
            return this;
        };
	}
	
	return Promise;
})();