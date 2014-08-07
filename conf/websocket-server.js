//Simon's adventure websocket server impl
module.exports = function(httpServ) {

	function Map() {
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
		var self = function dictionary(key, value) {
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
		self.size = function(){
			return obj.length;
		}
		self.delete = function(key) {
			obj.splice(find(key), 1);
		}
		self.each = function(func){
			for (var i = 0; i<obj.length; i++){
				var item = obj[i]
				var r = func(item[0], item[1]);
				if(r === false) break; 
			}
		}
		self.keys = function() {
			var keys = [];
			this.each(function(k, v) {
				keys.push(k);
			});
			return keys;
		}
		return self;
	}
	
	function GameList() {
		var games = new Map();
		var callbacks = new Map();
		
		var self =  function() {}
		self.get = function(name) {
			return games(name);
		}
		self.new = function(name) {
			var game = new Game(name, this);
			games(name, game);
			callbacks.each(function(o, callback) {
				callback()
			});
			
			console.log('[GAME CREATED] name: ' + game.getName());
			return game;
		}
		self.remove = function(game) {
			game.destroy();
			games.delete(game.name);
			callbacks.each(function(o, callback) {
				callback()
			});
			
			console.log('[GAME DELETED] name: ' + game.getName());
		}
		self.addObserver = function(observer) {
			var callback = function() {
		  		observer.sendMsg('game list', games.keys());
			};
			callbacks(observer, callback);
			callback();
			
			console.log("[SUBSCRIPTION] player: " + observer.ID);
		}
		self.removeObserver = function(observer) {
			callbacks.delete(observer);
			
			console.log("[UN-SUBSCRIPTION] player: " + observer.ID);
		}
		return self;
	}
	
	function Game(n, gl) {
		var self = function() {}
		var gameList = gl;
		var master = null;
		var players = [];
		self.getName = function() {
			return n;	
		}
		self.addPlayer = function(player) {
			if(master === null)
				master = player;
			
			players.forEach(function(p) {
				p.sendMsg('player joined game', {id: player.ID});
			});
			players.push(player);
			console.log("[GAME JOINED] game: " + this.getName() + ", " + (master === player ? "master" : "player") + ": " + player.ID);
		}
		self.removePlayer = function(player) {
			console.log("[GAME LEAVED] game: " + this.getName() + ", player: " + player.ID);
			
			if(player === master) {
				this.destroy();
				gameList.remove(this);
			} else {
				players.splice(players.indexOf(player), 1);
				players.forEach(function(p) {
					p.sendMsg('player left game', {id: player.ID});
				});
			}
		}
		self.destroy = function() {
			players.forEach(function(p) {
				p.sendMsg('game deleted');
			});
		}
		return self;
	}
	
	function PlayerList() {
		var players = new Map();
		var lastConnectionID = 0;
		
		var self = function() {}
		self.new = function(connection) {
			var ID = lastConnectionID++;

			var player = new Player(connection, ID); 
			player.sendMsg('confirm connect', {id: player.ID});
			players(ID, player);
			
			console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' [' + player.ID + '] connected.');
			
			// On player connection close
			connection.on('close', function(reasonCode, description) {
				player.leaveGame();
				players.delete(player.ID);
				console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' [' + player.ID + '] disconnected.');
			});
					
			return player;
		}
		
		return self;
	}
	
	function Player(c, i) {
		var self = function(c) {}
		self.connection = c;
		self.ID = i;
		
		var game = null;
		var onHandlers = {};
		
		// On message
		self.connection.on('message', function(message) {
			if(message.type === 'utf8') {
				var json;
				
				try {
					json = JSON.parse(message.utf8Data);	
				} catch(e) {}
				
				if(json && onHandlers[json.type] != undefined)
					onHandlers[json.type](json.content);
			}
		});
		
		self.joinGame = function(g) {
			game = g;
			game.addPlayer(this);
		}
		
		self.leaveGame = function() {
			if(game != null) {
				game.removePlayer(this);
				game = null;
			}
		}
		
		self.sendMsg = function(type, object) {
			var message = JSON.stringify({type: type, content: object});
			this.connection.send(message);
		}
		
		self.onMsg = function(type, callback) {
			onHandlers[type] = callback;
		}
		
		self.offMsg = function(type, callback) {
			if(onHandlers[type] != undefined)
				delete onHandlers[type];
		}
		
		return self;
	}
	
	//Authorizes or not the connections based on origin
	var authorizedOrigin = function(origin) {
		return true;
	}

	// Global list of all player connected
	var players = new PlayerList();
	
	// Global list of all game created and active
	var games = new GameList();
	
	// Init WebSocket server
	var ws = new (require('websocket').server)({
		httpServer: httpServ,
		autoAcceptConnections: false
	});
	
	// New connection to WebSocket server
	ws.on("request", function(con) {
		// Filter connection
		if(!authorizedOrigin(con.origin)) {
			request.reject();
			return;
		}
		
		// Accept connection & Add player to global list
		var player = players.new(con.accept('echo-protocol', con.origin));
		
		// Create game
		player.onMsg('create game', function(object) {
			if(ok = (games.get(object.name) === undefined))
				player.joinGame(games.new(object.name));
			
			player.sendMsg('confirm game create', {"ok": ok});
		});
		
		// Join game
		player.onMsg('join game', function(object) {
			if(ok = ((game = games.get(object.name)) != undefined))
				player.joinGame(game);
			
			player.sendMsg('confirm game join', {"ok": ok});	
		});
		
		// Leave game
		player.onMsg('leave game', function() {
			player.leaveGame();
		});
		
		// Subscribe list game
		player.onMsg('subscribe list game', function() {
			games.addObserver(player);
		});
		
		// Unsubscribe list game
		player.onMsg('unsubscribe list game', function() {
			games.removeObserver(player);
		});
		
		/*// Player action
		player.onMsg('action', function(object) {
			if(connection.game) {
				var recipient = undefined;
				if(connection.game.player1 == connection.ID) {
					recipient = connection.game.player2;
				}
				else if(connection.game.player2 == connection.ID) {
					recipient = connection.game.player1;
				}
				
				if(recipient != undefined)
					connections[recipient].sendMsg(object, 'action');
				else
					connection.sendMsg({}, "error player disconnected");
			}
		});*/
		
		
	});
}
