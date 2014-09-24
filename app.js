var http = require('http'),
	path = require('path'),
	fs = require('fs'),
	logger = require('morgan'),
	favicon = require('serve-favicon'),
	compression = require('compression'),
	express = require('express');

var app = express();

// Server folders
var folders = {
	assets		: path.join(__dirname, 'assets'),
	public		: path.join(__dirname, 'public'),
	routes		: path.join(__dirname, 'routes'),
	views		: path.join(__dirname, 'views'),
	server		: path.join(__dirname, 'server')
};

// Environnment configurations
app.set('port', process.env.PORT || 5000);
app.set('views', folders.views);
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(compression());

//Routes configuration
require(path.join(folders.server, "routes-config")) (
	app,
	folders
);

var compressJS = false;

// Developpement environment
if (app.get('env') === 'development') {

	console.log("[NODE_ENV] development");

	//StackTrace On
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
    
    compressJS = false;
}
// Production environment
else if(app.get('env') === 'production') {
	console.log("[NODE_ENV] production");
	
	//HTML5 cache manifest configuration
	require(path.join(folders.server, "cache-manifest")) (
		app,
		path,
		folders
	);
	
	compressJS = true;
}

// Merge & compress js files for client
require(path.join(folders.server, "javascript-packer")) (
	path, 
	folders,
	compressJS
);

//Launch HTTP server
var httpServ = http.createServer(app);
httpServ.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

//Launch WebSocket server
require(path.join(folders.server, "websocket", "server"))(
	httpServ
);