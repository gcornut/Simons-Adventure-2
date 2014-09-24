module.exports = function(app, folders) {
	var express = require("express"),
		path	= require("path");
	
	//Satic content
	app.use(express.static(folders.public));
	
	//Main page
	app.use("/", require(path.join(folders.routes, 'index')));
	
	//404 error
	app.use(function(req, res, next) {
	    var err = new Error('Not Found');
	    err.status = 404;
	    next(err);
	});
	
}