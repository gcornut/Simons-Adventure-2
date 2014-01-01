game.gui.screen.NewGameScreen = game.gui.screen.ComplexScreen.extend({
	
	init: function() {
		this.parent();
		
		this.bgImage = null;
		this.cancelBtn = null;
		this.okBtn = null;
		this.input = null;
		
		this.popup = null;
	},
	
	validate: function() {
		if(game.connection.isClosed()) game.connection.init();
		if(this.input.text != "") {
			if(game.connection.sendJSON({name: this.input.text}, "create game")) {
				this.onDestroyEvent();
				this.popup = new game.gui.PopUpFrame("creating game");
				var popup = this.popup;
				
				me.input.bindKey(me.input.KEY.ESC, "esc", true);
				game.connection.on("confirm game create", function(confirm) {
					if(confirm.ok) {
						popup.setText("waiting for\n player 2");
					}
					else popup.setText("name allready\nin use");
				});
			}
		}
	},

	onResetEvent: function() {
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
		
		this.parent();
		me.input.bindKey(me.input.KEY.ESC, "esc", true);
		me.input.bindKey(me.input.KEY.ENTER, "enter", true);
	},

	onDestroyEvent: function() {
		me.input.unbindKey(me.input.KEY.ESC);
		me.input.unbindKey(me.input.KEY.ENTER);
		this.input.setText("");
		game.connection.off("confirm create game");
		this.parent();
		this.popup = null;
	},

	draw: function(context) {
		if(me.input.isKeyPressed("enter"))
			this.okBtn.clicked();
		if(me.input.isKeyPressed("esc")) {
			if(this.popup != null){
				this.popup = null;
				this.onResetEvent();
				return;
			}
			this.cancelBtn.clicked();
			return;
		}
		
		context.drawImage(this.bgImage, 0, 0);
		
		this.parent(context);
		
		if(this.popup != undefined && this.popup != null)
			this.popup.draw(context);
	}
});