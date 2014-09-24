
var path = require("path");

// Server folders
var folders = {
	assets		: path.join(__dirname, 'assets'),
	public		: path.join(__dirname, 'public'),
	routes		: path.join(__dirname, 'routes'),
	views		: path.join(__dirname, 'views'),
	server		: path.join(__dirname, 'server')
};

//Launch HTTP server
var httpServ = require(path.join(folders.server, "http", "server"))(
	folders
);

//Launch WebSocket server
require(path.join(folders.server, "websocket", "server"))(
	httpServ
);
