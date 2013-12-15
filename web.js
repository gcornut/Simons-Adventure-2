
//Required modules
var http = require('http'),
	path = require('path'),
	fs = require('fs'),
	express = require('express');

var app = express();

// Server folders
var folders = {
	assets		: path.join(__dirname, 'assets'),
	public		: path.join(__dirname, 'public'),
	routes		: path.join(__dirname, 'routes'),
	views		: path.join(__dirname, 'views'),
	conf		: path.join(__dirname, 'conf')
};

// Environnment configurations
app.set('port', process.env.PORT || 5000);
app.set('views', folders.views);
app.set('view engine', 'ejs');
app.use(express.favicon(path.join(folders.public, 'favicon.ico')));
app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
//app.use(express.cookieParser('nomistech'));
//app.use(express.session());
app.use(app.router);

// Static acces to files in public/
app.use(express.static(folders.public));


var compressJS = false;
/*// Developpement environment
app.configure('development', function(){
	console.log("[NODE_ENV] development");
	
	app.get("/site.manifest", function(req, res) {
		res.status(404);
		res.setHeader("Content-Type", "text/cache-manifest");
		res.end("CACHE MANIFEST");
	});
	
	//Error handling
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	
	compressJS = false;
});

// Production environment
app.configure('production', function() {
	console.log("[NODE_ENV] production");

	//HTML5 cache manifest configuration
	require(path.join(folders.conf, "cache-manifest.js")) (
		app,
		path,
		folders
	);
	
	//Error handling
	app.use(express.errorHandler({ dumpExceptions: false, showStack: false }));
	
	compressJS = true;
});*/

// Merge & compress js files for client
require(path.join(folders.conf, "packer.js")) (
	path, 
	folders,
	compressJS
);

//Routes configuration
require(path.join(folders.conf, "routes.js")) (
	app,
	folders
);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
