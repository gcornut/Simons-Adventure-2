var game = {
	onload : function () {
		//me.sys.fps = 30;
	
		// Initialize the video.
		if (!me.video.init("screen", 640, 480, true, 1)) {
			alert("Your browser does not support HTML5 canvas.");
			return;
		}
		
		// add "#debug" to the URL to enable the debug Panel
		if (document.location.hash === "#debug") {
			window.onReady(function () {
				me.plugin.register.defer(debugPanel, "debug");
			});
		}

		// Initialize the audio.
		me.audio.init("mp3,ogg");

		// Set a callback to run when loading is complete.
		me.loader.onload = this.loaded.bind(this);
	 
		// Load the resources.
		me.loader.preload(game.resources);

		// Initialize melonJS and display a loading screen.
		me.state.change(me.state.LOADING);
	},

	// Run on game resources loaded.
	loaded : function () {
		me.state.MENU_NEWGAME = me.state.USER + 0;
		me.state.MENU_JOINGAME = me.state.USER + 1;
		me.state.MENU_INSTRUCTIONS = me.state.USER + 2;
	
		// add screens
		me.state.set(me.state.MENU, new game.gui.screen.TitleScreen());
		me.state.set(me.state.MENU_NEWGAME, new game.gui.screen.NewGameScreen());
		me.state.set(me.state.MENU_JOINGAME, new game.gui.screen.JoinGameScreen());
		me.state.set(me.state.MENU_INSTRUCTIONS, new game.gui.screen.InstructionsScreen());
		me.state.set(me.state.PLAY, new game.gui.screen.PlayScreen());
		me.state.set(me.state.GAME_END, new game.gui.screen.WinScreen());
		me.state.set(me.state.GAMEOVER, new game.gui.screen.LooseScreen());
		  
		// add our player entity in the entity pool
		me.entityPool.add("player1", game.entity.mob.Player);
		me.entityPool.add("player2", game.entity.mob.RemotePlayer);
		me.entityPool.add("compagny", game.entity.mob.EvilCompagny);
		me.entityPool.add("coin", game.entity.accessory.Coin);
		me.entityPool.add("winEntity", game.entity.WinEntity);
		
		// set a global fading transition for the screen
		me.state.transition("fade", "#000000", 250);
		
		//Load texture file
		game.texture = new me.TextureAtlas(me.loader.getJSON("simon"), me.loader.getImage("simon"));
		
		//Load gui texture file
		game.guiTexture = new me.TextureAtlas(me.loader.getJSON("gui"), me.loader.getImage("gui"));
		game.gui.font = new me.BitmapFont("32x32_font", 32);
		
		// start the game on menu
		me.state.change(me.state.MENU);
	},
	
	entity: {accessory:{}, mob:{}},
	
	gui: {
		screen: {
			screens: [],
			add: function(screen) {
				if(screen instanceof me.ScreenObject) {	
					var s = new screen();
					this.screens.push(s);
					return s
				}
				return false;
			}
		},
		images: {},
		getImageFromTexture: function(regionName) {
			if(this.images[regionName])
				return this.images[regionName];
			else {
				var region = game.guiTexture.getRegion(regionName);
				if(region) {
					var sprite = new me.SpriteObject(0,0, game.guiTexture.getTexture(), region.width, region.height);
					sprite.offset.setV(region.offset);
					
					return this.getImageFromSprite(regionName, sprite);
				}
				return undefined;
			}
		},
		getImageFromSprite: function(regionName, sprite) {
			if(this.images[regionName])
				return this.images[regionName];
			else {
				if(sprite) {
					var tmpCanvas = document.createElement("canvas"),
						context = tmpCanvas.getContext("2d");
					tmpCanvas.height = sprite.height;
					tmpCanvas.width = sprite.width;
					
					sprite.draw(context);
					
					return this.images[regionName] = context.canvas;
				}
				return undefined;
			}
		}
	},
	
	connection: {
		socket: undefined,
		remote: {},
		onHandlers: {},
		
		init: function() {
			var WebSocketClient = window.WebSocket || window.MozWebSocket;
			
			if(WebSocketClient) {
				this.socket = new WebSocketClient(location.origin.replace(/^http/, 'ws'), 'echo-protocol');
				
				var con = this;
				this.socket.onopen = function() {
					con.on("warn", function(object) {
					    console.log("[WARN] " + object.msg);
					});
					con.on("action", function(object) {
					    this.remote = object;
					});
					con.on("confirm connect", function(object) {
					    console.log('Socket connection opened [id:' + object.id + ']');
					});
				};
				//this.socket.onerror; //Stuff to do when error occurs
				
				var onHandlers = this.onHandlers;
				this.socket.onmessage = function(message) {
					var json;
					
					try {
						json = JSON.parse(message.data);	
					}
					catch(e) {/*Error parsing message JSON data (causes: data not string or JSON malformed)*/}
					
					if(json) {
						if(onHandlers[json.type] != undefined)
							onHandlers[json.type](json.content);
					}
				}
				
				this.socket.onclose = function(e) {
					console.log("Socket connection closed");
				}
				
				return true;
			}
			else return false;
		},
		
		on: function(type, callback) {
			this.onHandlers[type] = callback;	
		},
		
		off: function(type) {
			if(this.onHandlers[type] != undefined)
				delete this.onHandlers[type];	
		},
		
		sendMsg: function(type, object) {
			if(this.isOpened() && this.socket != undefined) {
				var message = JSON.stringify({type: type, content: object});
				this.socket.send(message);
				console.log(message);
				return true;
			}
			else return false;
		},
		
		isClosed: function() {
			return this.socket == undefined || this.socket.readyState === this.socket.CLOSED || this.socket.readyState === this.socket.CLOSING;
		},
				
		isOpened: function() {
			return this.socket != undefined && this.socket.readyState === this.socket.OPEN;
		}
	}
};
