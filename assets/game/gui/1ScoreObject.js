game.ScoreObject = me.Renderable.extend({


	init: function(x, y) {
		// call the parent constructor
		this.parent(x, y);
		// create a font
		this.font = new me.BitmapFont("32x32_font", 32);
		this.font.set("right");
	},


	draw: function(context, x, y) {
		this.font.draw(context, this.value, this.pos.x + x, this.pos.y + y);
	}

});