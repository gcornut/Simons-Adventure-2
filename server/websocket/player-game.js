
var Map = require("./map").Map;

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

module.exports.Game = Game;
module.exports.GameList = GameList;

module.exports.Player = Player;
module.exports.PlayerList = PlayerList;
