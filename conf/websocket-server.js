function HashMap() {
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
    var d = function dictionary(key, value) {
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
    d.size = function(){
    	return obj.length;
    }
    d.delete = function(key) {
    	obj.splice(find(key), 1);
    }
    d.each = function(func){
    	for (var i = 0; i<obj.length; i++){
    		var item = obj[i]
    		func(item[0], item[1]); 
    	}
    }
    return d;
}

function GameList() {
    var list = new HashMap();
    var callbacks = new HashMap();
    
    var g =  function() {}
    g.get = function(name) {
    	return list(name);
    }
    g.add = function(game) {
    	list(game.name, game);
    	
    	callbacks.each(function(o, callback) {
    		callback()
    	});
    }
    g.remove = function(game) {
    	list.delete(game.name);
    	callbacks.each(function(o, callback) {
    		callback()
    	});
    }
    g.addObserver = function(observer) {
    	var callback = function() {
    		var games = [];
    		list.each(function(name, game){
    			games.push(game);
    		});
    	
    		observer.sendJSON(games, 'game list');
    	};
    	callbacks(observer, callback);
    	callback();
    }
    g.removeObserver = function(observer) {
    	callbacks.delete(observer);	
    }
    return g;
}

	/*
	var games = new GameList();
	games.addObserver({sendJSON: function(list){console.log("changed "); console.log(list)}});
	games.add({name: "TOTO"});
	games.add({name: "TOTO2"});
	games.add({name: "TOTO3"});*/
	/*
	game.connection.init();
	game.connection.sendJSON({}, "subscribe list game");
	game.connection.on("game list", function(list){console.log(list)});
	game.connection.sendJSON({name: "TOTO"}, "create game");
	*/
	
//Simon's adventure websocket server impl
module.exports = function(httpServ) {
	//Authorizes or not the connections based on origin
	var authorizedOrigin = function(origin) {
		return true;
	}
	
	var connections = {};
	
	var games = new GameList();
	
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
			var message = JSON.stringify({type: type, content: object});
			connection.send(message);
			//console.log(message);
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
						onHandlers[json.type](json.content);
				}
			}
		});
		
		connection.onMsg('create game', function(object) {
			var ok = false;
			
			if(games.get(object.name) == undefined) {
					var game = {
						name: object.name,
						player1: connection.ID,
						player2: undefined
					};
					games.add(game); 
					connection.game = game;
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
						
			if((game = games.get(object.name)) != undefined) {
					game.player2 = connection.ID;
					connection.game = game;
					console.log(
						'['+connection.ID+']'+
						'joined game named : '+
						object.name
					);
					
					ok = true;
					connections[game.player1].sendJSON({}, 'player joined game');
			}
			
			//Confirm
			connection.sendJSON({"ok": ok}, 'confirm game join');	
		});
		connection.onMsg('leave game', function() {
			if(connection.game) {
				var recipient = undefined;
				if(connection.game.player1 == connection.ID) {
					recipient = connection.game.player2;
				}
				else if(connection.game.player2 == connection.ID) {
					recipient = connection.game.player1;
				}
				
				if(recipient) {
					connections[recipient].sendJSON({}, 'player left game');
				} else {
					games.remove(connection.game);
				}
				
				connection.game = undefined;
			}
		});
		
		connection.onMsg('subscribe list game', function() {
			console.log("["+connection.ID+"] subsrcibed to the list of games");
			games.addObserver(connection);
		});
		
		connection.onMsg('unsubscribe list game', function() {
			games.removeObserver(connection);
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
					connections[recipient].sendJSON(object, 'action');
				else
					connection.sendJSON({}, "error player disconnected");
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
					games.remove(connection.gam);
			}
			delete connections[connection.ID];
			console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' [' + connection.ID + '] disconnected.');
		});
	});
}
