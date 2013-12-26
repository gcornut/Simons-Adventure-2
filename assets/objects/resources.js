game.resources = [

	// Win
    {name: "winEntity", type:"image", src: "img/sprite/winEntity.png"},
    {name: "win",  type:"image", src: "img/gui/win.jpg"},
    
    // loose screen
    {name: "loose",  type:"image", src: "img/gui/loose.jpg"},

	// title screen
    {name: "title",  type:"image", src: "img/gui/title.jpg"},
    
    // sky
    {name: "sky",  type:"image", src: "img/map/sky.png"},
    
    // town
    {name: "town",  type:"image", src: "img/map/town.png"},
    
    // level tileset
    {name: "lvl1",  type:"image", src: "img/map/lvl1.png"},
     
    // map lvl1
    {name: "lvl1", type: "tmx", src: "map/lvl1.tmx"},
    
    // Hero
	{name: "simon",		type: "json",	src: "img/sprite/simon.json"},
	{name: "simon",		type: "image",	src: "img/sprite/simon.png"},

    // Enemies
    {name: "castle", type:"image", src: "img/sprite/enemies/castle.png"},
    {name: "helium", type:"image", src: "img/sprite/enemies/helium.png"},
    {name: "prizm", type:"image", src: "img/sprite/enemies/prizm.png"},
    
    // Coins
    {name: "coin", type:"image", src: "img/sprite/coin.png"},
    
    // Bullet
    {name: "bullet", type:"image", src: "img/sprite/bullet.png"},
    
    //font
    {name: "32x32_font", type:"image", src: "img/font/32x32_font.png"},
	
	// sound effect
	{name: "jump", type: "audio", src: "sfx/", channel : 2},
	{name: "coin", type: "audio", src: "sfx/", channel : 2},
	{name: "bg_loose", type: "audio", src: "bgm/", channel : 1},
	{name: "bg_game_music", type: "audio", src: "bgm/", channel : 1},
	{name: "bg_win_1", type: "audio", src: "bgm/", channel : 1},
	{name: "bg_win_2", type: "audio", src: "bgm/", channel : 1}
];
