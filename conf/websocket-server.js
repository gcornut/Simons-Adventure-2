//Simon's adventure websocket server impl
module.exports = function(httpServ) {
	//Authorizes or not the connections based on origin
	var authorizedOrigin = function(origin) {
		return true;
	}
	
	var connections = {};
	var games = {};
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
		var onHandlers = {};
		connection.onMsg = function(type, callback) {
			onHandlers[type] = callback;
		}
		connection.offMsg = function(type, callback) {
			if(onHandlers[type] != undefined)
				delete onHandlers[type];
		}
		connection.on('message', function(message) {
			if(message.type === 'utf8') {
				var json;
				
				try {
					json = JSON.parse(message.utf8Data);	
				}
				catch(e) {}
				
				if(json) {
					if(onHandlers[json.type] != undefined)
						onHandlers[json.type](json);
				}
			}
		});
		
		connection.onMsg('create game', function(object) {
			var ok = false;
			
			if(games[object.name] == undefined) {
			    games[object.name] = {
			    	name: object.name,
			    	player1: connection.ID,
			    	player2: undefined
			    };
			    connection.game = games[object.name];
			    console.log(
			    	'['+connection.ID+'] '+
			    	'created game named : '+
			    	object.name
			    );
			    
			    ok = true;
			}
			
			//Confirm
			connection.sendJSON({"ok": ok}, 'confirm game create');
		});
		connection.onMsg('join game', function(object) {
			var ok = false;
						
			if(games[object.name] != undefined) {
			    games[object.name].player2 = connection.ID;
			    connection.game = games[object.name];
			    console.log(
			    	'['+connection.ID+']'+
			    	'joined game named : '+
			    	object.name
			    );
			    
			    ok = true;
			    connections[games[object.name].player1].sendJSON({}, 'player2 joined game');
			}
			
			//Confirm
			connection.sendJSON({"ok": ok}, 'confirm game join');	
		});
		connection.onMsg('leave game', function(object) {
			//close game, warn P1 & P2	
		});
		connection.onMsg('action', function(object) {
			if(connection.game) {
			    var recipient = undefined;
			    if(connection.game.player1 == connection.ID) {
			    	recipient = connection.game.player2;
			    }
			    else if(connection.game.player2 == connection.ID) {
			    	recipient = connection.game.player1;
			    }
			    
			    if(recipient != undefined)
			    	connections[recipient].sendJSON(object);
			    else
			    	connection.sendJSON({}, "error friend disconnected");
			}
		});
		
		//On close
		connection.on('close', function(reasonCode, description) {
			if(connection.game) {
				if(connection.game.player1 == connection.ID)
					connection.game.player1 = undefined;
				else if(connection.game.player2 == connection.ID)
					connection.game.player2 = undefined;
					
				if(connection.game.player2 == undefined && connection.game.player2 == undefined)
					delete games[connection.game.name];
			}
			delete connections[connection.ID];
			console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' [' + connection.ID + '] disconnected.');
		});
	});
}
