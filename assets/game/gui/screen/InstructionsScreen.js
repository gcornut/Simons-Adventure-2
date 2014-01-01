game.gui.screen.InstructionsScreen = game.gui.screen.ComplexScreen.extend({
	
	init: function() {
		this.parent();
		
		this.bgImage = null;
		
		this.backBtn = null;
	},

	onResetEvent: function() {
		if (this.bgImage == null) {
			this.bgImage = me.loader.getImage("menu_bg");
			
			this.add([
				new game.gui.TextBox({
					text: "instructions", 
					align: "center middle",
					width: 520,
					frame: true
				}),
				
				new game.gui.TextBox({
				    text:	"controls:\n\n"+
				    		"arrows: move\n"+ 
				    		"space:  shoot",
				    width: 520, 
				    height: 320,
				    frame: true
				}),
				
				this.backBtn = new game.gui.Button({
					text: "back", 
					action: me.state.MENU, 
					width: 300
				})
			]);
		}
		
		this.parent();
		me.input.bindKey(me.input.KEY.ESC, "esc", true);
	},
	
	onDestroyEvent: function() {
		me.input.unbindKey(me.input.KEY.ESC);
		this.parent();
	},

	draw: function(context) {
		if(me.input.isKeyPressed("esc")) {
			this.backBtn.clicked();
			return;
		}
		
		context.drawImage(this.bgImage, 0, 0);
		
		this.parent(context);
	}
});