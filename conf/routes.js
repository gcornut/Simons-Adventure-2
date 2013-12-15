module.exports = function(app, folders) {
	var path = require('path'),
		fs = require('fs');
	
	var urls = [];
	
	var defaultLoad = function(req, res) {
		var userAgent = req.headers['user-agent'];
		matches = userAgent.match(/MSIE (\d+).\d+\w?;/);
		
		if(matches && parseInt(matches[1]) <= 8) {
			console.log("IE <= 8");
			res.render('error/ie');
			res.end();
		}
		else {
			res.callback(req, res);
		}

	}
	
	function routeExists(url) {
		for(u in urls) {
			if(url == "/") {
				if(urls[u] == url)
					return true;
			}
			else if(urls[u].replace(/\/$/, "").indexOf(url.replace(/\/$/, "")) == 0)
				return true;
			
		}
		return false;
	}
	
	function addRoute(url, page) {
		if(
			!routeExists(url) && 
			!(typeof page == 'string' && page.indexOf(".") == 0)
		) {
			urls.push(url);
			
			var processor = function(req, res) {
				res.callback = (typeof page == 'string') ? 
					function(req, res) {
						res.render(page, {page: req.url})
					} : page;
				defaultLoad(req, res);
			}
			
			//console.log("ADD: " + url + " - " + processor);
			app.get(url, processor);
		}
	}
	
	//Custom routes
	fs.readdir(folders.routes, function (err, files) {
		if (err) throw err;
		
		files.forEach( function (file) {
			if(file.match(/\.js$/)) {	
				var route = require(path.join(folders.routes, file));
				
				if(route != undefined) {
					if(route.url == undefined) {	
						app.get("/"+file, route.processor);
					}
					else {
						if (typeof route.url == 'string' || route.url instanceof String) {
							app.get(route.url, route.processor);
						}
						else {
							for(url in route.url) {
								//console.log(route.url[url]);
								addRoute(route.url[url], route.processor);
							}
						}
					}
						
				}
			}
		});
	});
	
	//Automatic routes
	fs.readdir(folders.views, function (err, files) {
		if (err) throw err;
	
		files.forEach( function (file) {
			if(file.match(/\.ejs$/)) {
				var fileName = file.replace(/\..{1,5}$/, "");
					
				if(fileName.indexOf("index") !== -1)
					addRoute("/", fileName);
					
				addRoute("/" + fileName, fileName);
			}
		});
	});
	
	//404 Not found
	app.use(function(req, res, next){
		res.status(404);
		
		// respond with html page
		if (req.accepts('html')) {
			res.render('error/404', {"page": req.url});
			return;
		}
		
		// default to plain-text. send()
		res.type('txt').send('Not found');
	});
	
}