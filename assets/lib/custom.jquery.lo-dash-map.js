/*
 * Algorithms from Lo-dash: http://lodash.com/
 * Adapted to replace jQuery.map
 */
(function($) {
	var forOwn = function(collection, callback, thisArg) {
		var index, iterable = collection, result = iterable;
		
		if (!iterable) return result;
		if (!objectTypes[typeof iterable]) return result;
		
		callback = callback && typeof thisArg == 'undefined' ? callback : $.proxy(callback, thisArg);
		
		var ownIndex = -1,
		    	ownProps = objectTypes[typeof iterable] && keys(iterable),
		    	length = ownProps ? ownProps.length : 0;

		while (++ownIndex < length) {
		    index = ownProps[ownIndex];
		    if (callback(iterable[index], index, collection) === false) return result;
		}

		return result
	}

	$.map = function(collection, callback, thisArg) {
		var index = -1,
			length = collection ? collection.length : 0;

		callback = $.proxy(callback, thisArg);
		if (typeof length == 'number') {
			var result = Array(length);
			while (++index < length) {
				result[index] = callback(collection[index], index, collection);
			}
		} else {
			result = [];
			forOwn(collection, function(value, key, collection) {
				result[++index] = callback(value, key, collection);
			});
		}
		return result;
	}
})(jQuery);