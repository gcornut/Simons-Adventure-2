//@require game.gui.Component

game.gui.PopUpFrame = game.gui.Component.extend({
	init: function(text, parentScreen) {
		this.parent({x: 0, y: 0, width: me.video.getWidth(), height: me.video.getHeight(), cache: false});
	
		this.textBox = new game.gui.TextBox({
			text: text, 
			align: "center middle", 
			frame: true, 
			fitTextH: true,
			fitTextV: true,
			centeredH: true,
			centeredV: true
		});

		this.parentScreen = parentScreen;
		if(this.parentScreen.onDestroyEvent) 
			this.parentScreen.onDestroyEvent();
		
		this.animScale = new game.gui.Animation({from: 0, to: 1, sec: 0.8});
		this.animAppear = new game.gui.Animation({from: 0, to: 0.6, sec: 0.8});
		
		this.closable = true;
		me.input.bindKey(me.input.KEY.ESC, "esc", true);
	},
	
	setText: function(text) {
		this.textBox.setText(text, true, true);
	},
	
	close: function() {
		me.input.unbindKey(me.input.KEY.ESC);
		this.parentScreen.onResetEvent();
	},
	
	draw: function(context) {
		if(me.input.isKeyPressed("esc") && this.closable) {
			return this.close();
		}
		
		var scale = this.animScale.nextStep(),
			appear = this.animAppear.nextStep();
		
		//Draw black background
		context.globalAlpha = appear;
		context.fillStyle = 'black';
		context.fillRect(this.pos.x, this.pos.y, this.width, this.height);
		context.globalAlpha = 1;
		
		var	width = this.textBox.width * scale,
		    height = this.textBox.height * scale,
		    posX = (this.width / 2 - width / 2),
		    posY = (this.height / 2 - height / 2);
		
		//Draw textBox
		if(this.textBox.needUpdate)
			this.textBox.render();
		
		context.drawImage(this.textBox.cache, posX, posY, width, height);
		//this.textBox.draw(context);
	}
});
