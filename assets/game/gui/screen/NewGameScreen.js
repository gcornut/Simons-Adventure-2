game.gui.screen.NewGameScreen = game.gui.screen.ComplexScreen.extend({
	
	init: function() {
		this.parent();
		
		this.bgImage = null;
		this.cancelBtn = null;
		this.okBtn = null;
		this.input = null;
		
		this.popup = null;
		
		this.active = true;
	},
	
	validate: function() {
		if(game.connection.isClosed()) game.connection.init();
		if(this.input.text != "") {
			if(game.connection.sendJSON({name: this.input.text}, "create game")) {
				
				this.popup = new game.gui.PopUpFrame("creating game", this);
				
				game.connection.on("confirm game create", jQuery.proxy(function(confirm) {
					if(confirm.ok) {
						this.popup.setText("waiting for\n player 2");
					}
					else this.popup.setText("name allready\nin use");
				}, this));
			}
		}
	},

	onResetEvent: function() {
		
		this.active = true;
		
		if(game.connection.isClosed()) game.connection.init();
		
		if (this.bgImage == null) {
			this.bgImage = me.loader.getImage("menu_bg");
			
			this.add([
				new game.gui.TextBox({
					text: "ENTER THE NAME\n OF YOUR GAME",
					align: "center"
				}),
				
				this.input = new game.gui.InputText({
					maxTextLength: 14,
				}),
				
				new game.gui.Panel({
					width: 410,
					spacing: 30,
					components: [
						this.cancelBtn = new game.gui.Button({text: "cancel", action: me.state.MENU, width: 190}), 
						this.okBtn = new game.gui.Button({text: "ok", action: jQuery.proxy(this.validate, this), width: 190})
					],
					layout: game.gui.Panel.HORIZONTAL
				})
			]);
		}
		this.popup = null;
		
		this.parent();
		me.input.bindKey(me.input.KEY.ESC, "esc", true);
		me.input.bindKey(me.input.KEY.ENTER, "enter", true);
	},

	onDestroyEvent: function() {
		this.active = false;
		
		me.input.unbindKey(me.input.KEY.ESC);
		me.input.unbindKey(me.input.KEY.ENTER);
		this.input.setText("");
		game.connection.off("confirm create game");
		this.parent();
	},

	draw: function(context) {
		if(this.active) {
			if(me.input.isKeyPressed("enter"))
				this.okBtn.clicked();
			if(me.input.isKeyPressed("esc")) {
				this.cancelBtn.clicked();
				return;
			}
		}
		
		context.drawImage(this.bgImage, 0, 0);
		
		this.parent(context);
		
		if(this.popup != null && !this.active)
			this.popup.draw(context);
	}
});