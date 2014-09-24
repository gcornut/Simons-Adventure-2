game.gui.screen.JoinGameScreen = game.gui.screen.ComplexScreen.extend({
	
	init: function() {
		this.parent();
		
		this.bgImage = null;
		this.cancelBtn = null;
		this.okBtn = null;
		this.scrollPanel = null;
		
		this.popup = null;
		
		this.active = true;
	},
	
	validate: function() {
		
	},

	onResetEvent: function() {
		this.active = true;
		
		if(game.connection.isClosed()) game.connection.init();
		
		if (this.bgImage == null) {
			this.bgImage = me.loader.getImage("menu_bg");
			
			this.add([
				new game.gui.TextBox({
					text: "CHOOSE A GAME",
					align: "center"
				}),
				
				this.scrollPanel = new game.gui.ScrollPanel({}),
				
				new game.gui.Panel({
					width: 410,
					spacing: 30,
					components: [
						this.cancelBtn = new game.gui.Button({text: "cancel", action: me.state.MENU, width: 190}),
					],
					layout: game.gui.Panel.HORIZONTAL
				})
			]);
		}
		this.popup = null;
		
		this.parent();
		me.input.bindKey(me.input.KEY.ESC, "esc", true);
	},

	onDestroyEvent: function() {
		this.active = false;
		
		me.input.unbindKey(me.input.KEY.ESC);
		this.parent();
	},

	draw: function(context) {
		if(this.active) {
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