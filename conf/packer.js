module.exports = function(path, folders, compressJS) {		
	var packer = require('node.packer');
	compressJS = compressJS == undefined ? true : compressJS;
	
	var defaultPacker = function(input, output, compressed) {
		compressed = compressed == undefined ? compressJS : compressed;
		packer({
			log: true,
			uglify: compressed,
			minify: compressed,
			input: input,
			output: output,
			callback: function(err, code) { err && console.log(err)}
		});
	}
	
	var fs = require('fs');
	var walk = function(dir, done) {
		var results = [];
		fs.readdir(dir, function(err, list) {
			if (err) return done(err);
			var pending = list.length;
			if (!pending) return done(null, results);
			list.forEach(function(file) {
				file = dir + '/' + file;
				fs.stat(file, function(err, stat) {
					if (stat && stat.isDirectory()) {
						walk(file, function(err, res) {
							results = results.concat(res);
							if (!--pending) done(null, results);
						});
					} else {
						if(file.match(/\.js$/)) results.push(file);
						if (!--pending) done(null, results);
					}
				});
			});
		});
	};
	
	defaultPacker(
		[
			path.join(folders.assets, "lib", "jquery-1.10.2.min.js"),
			path.join(folders.assets, "lib", "jquery.easing.min.js"),
			path.join(folders.assets, "lib", "custom.jquery.lo-dash-map.js"),
			path.join(folders.assets, "lib", "melonJS-0.9.10.js"),
			path.join(folders.assets, "lib", "plugins", "debugPanel.js"),
		], 
		path.join(folders.public, "js", "libs.min.js"),
		true
	);
	
	walk(path.join(folders.assets, "game"), function(err, gameRessources) {
		if (err) throw err;
		var libs = [
			path.join(folders.public, "js", "libs.min.js"),
			path.join(folders.assets, "game.js"),
			path.join(folders.assets, "resources.js")
		];
		
		var jsFiles = libs.concat(gameRessources);
		
		//console.log(jsFiles);
		defaultPacker(
			jsFiles, 
			path.join(folders.public, 'js', 'simonsadventure.js')
		);
	});
}
