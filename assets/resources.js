game.resources = [

	// Gui texture
	{name: "gui",			type: "json",	src: "img/gui/gui.json"},
	{name: "gui",			type: "image",	src: "img/gui/gui.png"},
							
	// Win screen & entity
    {name: "winEntity",		type:"image",	src: "img/sprite/winEntity.png"},
    {name: "win",			type:"image",	src: "img/gui/win.jpg"},
    						
    // Loose screen bg		
    {name: "loose",			type:"image",	src: "img/gui/loose.jpg"},
							
	// Title screen bg		
    {name: "menu_bg",		type:"image",	src: "img/gui/menu_bg.jpg"},
    {name: "menu_logo",		type:"image",	src: "img/gui/logo.png"},
    {name: "menu_simon",	type:"image",	src: "img/gui/simon.png"},
    						
    // Level 1				
    {name: "lvl1",			type:"image",	src: "img/map/lvl1.png"},
    {name: "lvl1",			type: "tmx",	src: "map/lvl1.tmx"},
    // Sky bg				
    {name: "sky",			type:"image",	src: "img/map/sky.png"},
    // Town bg				
    {name: "town",			type:"image",	src: "img/map/town.png"},
    						
    // Hero					
	{name: "simon",			type: "json",	src: "img/sprite/simon.json"},
	{name: "simon",			type: "image",	src: "img/sprite/simon.png"},
							
    // Enemies				
    {name: "castle",		type:"image",	src: "img/sprite/enemies/castle.png"},
    {name: "helium",		type:"image",	src: "img/sprite/enemies/helium.png"},
    {name: "prizm",			type:"image",	src: "img/sprite/enemies/prizm.png"},
    						
    // Coin					
    {name: "coin",			type:"image",	src: "img/sprite/coin.png"},
    									 	
    // Bullet							 	
    {name: "bullet",		type:"image",	src: "img/sprite/bullet.png"},
    									 	
    // Font								 	
    {name: "32x32_font",	type:"image",	src: "img/font/32x32_font.png"},
							
	// Sound effect			
	{name: "jump",			type: "audio",	src: "sfx/", channel : 2},
	{name: "coin",			type: "audio",	src: "sfx/", channel : 2},
										  	
	// Background music					  	
	{name: "bg_loose",		type: "audio",	src: "bgm/", channel : 1},
	{name: "bg_game_music", type: "audio",	src: "bgm/", channel : 1},
	{name: "bg_win_1",		type: "audio",	src: "bgm/", channel : 1},
	{name: "bg_win_2", 		type: "audio",	src: "bgm/", channel : 1}
];
