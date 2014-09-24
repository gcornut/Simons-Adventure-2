module.exports = function(path, folders, compressJS) {	
	var esprima = require('esprima');	
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
	
	
	var gameFolder = path.join(folders.assets, "game");
	var BreakException= {};
	
	//Walk through a dir and list js files
	var walk = function(dir, done) {
		function resolveImport(file, results) {
		
		    function objectName(object) {
		        if(object.type === "MemberExpression")
		        	return objectName(object.object) + "." + object.property.name;
		        else if(object.type === "Identifier")
		        	return object.name;
		        else return "";
		    }
			
			var index = results.indexOf(file);

			if(index == -1) {		    
		    	var imported = false; 
			    var data = fs.readFileSync(file);
			    
			    //Parse JS
			    var program = esprima.parse(data.toString('utf-8', 0, data.length));
			    if(program.type === "Program") {
			    	try {		    	
					    program.body.forEach(function(statement) {
						    if(statement.type === "ExpressionStatement") {
						    	//Find assigment
						    	if(statement.expression.type === "AssignmentExpression" && statement.expression.operator === "=") {
						    		var assignement = statement.expression;
						    		
						    		//Using class method extend
						    		if(assignement.right.type === "CallExpression" && assignement.right.callee.property.name === "extend") {
							    		var classCalled = objectName(assignement.right.callee.object);
							    		
							    		//On a game class
							    		if(classCalled.indexOf("game.") == 0) {
											var classPath = path.join(
												gameFolder, 
												classCalled
													.replace(/game\./g, "")
													.replace(/\./g, path.sep) 
													+ ".js"
											);
											
											var indexImport = results.indexOf(classPath);
				    	    	
							    	    	if(indexImport == -1) {
							    		    	resolveImport(classPath, results);
							    		    	indexImport = results.indexOf(classPath);
							    	    	}
							    	    	
							    	    	results.splice(indexImport+1, 0, file);
							    	    	imported = true;
							    	    	throw BreakException;
							    		} 
						    		}
						    	}
						    }
					    });  
			    	} catch(e) {
				    	if(e !== BreakException) throw e;
			    	}
			    }
			    
			    if(!imported)
			    	results.push(file);
			}
		}
	
		var results = [];
		fs.readdir(dir, function(err, list) {
			if (err) return done(err);
			var pending = list.length;
			if (!pending) return done(null, results);
			list.forEach(function(file) {
				file = path.join(dir, file);
				fs.stat(file, function(err, stat) {
					if (stat && stat.isDirectory()) {
						walk(file, function(err, res) {
							results = results.concat(res);
							if (!--pending) done(null, results);
						});
					} else {
						if(file.match(/\.js$/)) {
							resolveImport(file, results);
						}
						if (!--pending) done(null, results);
					}
				});
			});
		});
	};

	//libs.js	
	defaultPacker(
		[
			//path.join(folders.assets, "lib", "peer.min.js"),
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
			path.join(folders.assets, "game.js")
		];
		
		var jsFiles = libs.concat(gameRessources);
		//console.log(jsFiles);
		defaultPacker(
			jsFiles, 
			path.join(folders.public, 'js', 'simonsadventure.js')
		);
	});
}
