
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
});*///HTML5 cache manifest configuration

app.get("/site.manifest", function(req, res) {
	res.status(404);
	res.setHeader("Content-Type", "text/cache-manifest");
	res.end("CACHE MANIFEST");
});
	
/*require(path.join(folders.conf, "cache-manifest.js")) (
	app,
	path,
	folders
);*/


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

var httpServ = http.createServer(app);
//	io		 = require('socket.io').listen(httpServ);

httpServ.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

//Authorizes or not the connections based on origin
var authorizedOrigin = function(origin) {
	return true;
}

var connections = {}; 
var lastConnectionID = 0;

var WebSocketServer = require('websocket').server;

var ws = new WebSocketServer({
	httpServer: httpServ,
	autoAcceptConnections: false
});

ws.on("request", function(con) {
	if(!authorizedOrigin(con.origin)) {
		request.reject();
		return;
	}
	
	//Accept connection
	var connection = con.accept('echo-protocol', con.origin);
	connections[++lastConnectionID] = connection;
	connection.ID = lastConnectionID;
	connection.sendJSON = function(object, type) {
		if(type != undefined) {
			object.type = type;
		}
		connection.send(JSON.stringify(object));
	}
	console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' [' + connection.ID + '] connected.');
	connection.sendJSON({id: connection.ID}, 'confirm connect');
    
    //On message
    connection.on('message', function(message) {
	    if(message.type === 'utf8') {
		    var json;
		    
		    try {
				json = JSON.parse(message.utf8Data);    
		    }
		    catch(e) {}
		    
		    if(json) {
			    if(json.type === 'set friend') {
				    //Store friend id in connection
				    connection.FID = json.FID;
				    console.log('['+connection.ID+'] requested friend ['+connection.FID+']')
				    //Confirm
				    connection.sendJSON({ok: true}, 'confirm friend');
				    
				    if(connection.FID && connections[connection.FID]) {
					    connections[connection.FID].FID = connection.ID;
				    }
			    }
			    else if(json.type === 'action') {
			    	if(connection.FID && connections[connection.FID]) {
			    		connections[connection.FID].sendJSON(json);
			    	}
			    	/*else {
			    		connection.sendJSON({msg:'No friend set'}, 'warn');
			    	}*/
			    }
		    }
	    }
    });
    
    //On close
	connection.on('close', function(reasonCode, description) {
		delete connections[connection.ID];
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' [' + connection.ID + '] disconnected.');
    });
});