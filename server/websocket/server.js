var playerGame = require("./player-game"),
	Game = playerGame.Game,
	GameList = playerGame.GameList,
	Player = playerGame.Player,
	PlayerList = playerGame.PlayerList;

//Simon's adventure websocket server impl
module.exports = function(httpServ) {
		
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
