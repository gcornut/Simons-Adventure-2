module.exports.Map = function Map() {
    var obj = [];
    function find(key){
    	var i = obj.length;
    	while (i--) {
    		var curr = obj[i];
    		if (curr[0] === key) {
    			return i;
    		}
    	}
    	return null;
    }
    var self = function dictionary(key, value) {
    		var index = find(key);
    		if (value) {
    			if (index != null){
    				obj.splice(index, 1);
    			}
    			obj.push([key, value]);
 			
    		} else {
    			if (index != null){
    				return obj[index][1];
    			}
    		}
    }
    self.size = function(){
    	return obj.length;
    }
    self.delete = function(key) {
    	obj.splice(find(key), 1);
    }
    self.each = function(func){
    	for (var i = 0; i<obj.length; i++){
    		var item = obj[i]
    		var r = func(item[0], item[1]);
    		if(r === false) break; 
    	}
    }
    self.keys = function() {
    	var keys = [];
    	this.each(function(k, v) {
    		keys.push(k);
    	});
    	return keys;
    }
    return self;
}