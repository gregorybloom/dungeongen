
var GSpreadTree = namespaceFn('Gen01.SpreadTree');
var DSpreadTree = namespaceFn('Dung01.SpreadTree');

var GSepSteer = namespaceFn('Gen02.SeparateSteer');
var DSepSteer = namespaceFn('Dung02.SeparateSteer');


GAMEMODEL={
	gameAreas: {},
	gamePlayers: {},
	gameCamera: null,

	gameMode: "GAME_INIT",
	gameClock: null,
	
	activeObjs: 0,
	
	generationNum: 0,
	generator: null,
	dungeon: null,
	
	drawcount: 0	
};

GAMEMODEL.init = function()
{
	this.gameClock = GameClock.alloc();
	
	this.gameCamera = GameCamera.alloc();
	this.gameCamera.displaySize = {w:GAMEVIEW.screen.w,h:GAMEVIEW.screen.h};
	this.gameCamera.baseSize = {w:GAMEVIEW.screen.w,h:GAMEVIEW.screen.h};

	
	var area1 = GameArea.alloc();
//	area1.size = {w:1400,h:750};
	area1.size = {w:GAMEVIEW.screen.w*3,h:GAMEVIEW.screen.h*3};
	area1.updatePosition({x:-area1.size.w/2, y:-area1.size.h/2});
	this.gameAreas[0] = area1;
	
	var C = CharActor.alloc();
	C.updatePosition({x:200,y:100});
	area1.activeActors.push(C);
	this.gamePlayers[0] = C;
	

	GAMEMODEL.startGame();
	
	return true;
};

GAMEMODEL.readInput = function(inputobj)
{
	var keyused = false;
	var keyids = GAMECONTROL.keyIDs;
		
	var gennum = this.generationNum;
	if(keyids['KEY_1'] == inputobj.keyID)
	{
		keyused = true;
		if(!inputobj.keypress)		this.changeGenerator(1);
	}	
	if(keyids['KEY_2'] == inputobj.keyID)
	{
		keyused = true;
		if(!inputobj.keypress)		this.changeGenerator(2);
	}	
	if(keyids['KEY_3'] == inputobj.keyID)
	{
		keyused = true;
		if(!inputobj.keypress)		this.changeGenerator(3);
	}
	
	if(!keyused)
	{
		if(this.generator != null)	keyused = keyused || this.generator.readInput(inputobj);
		else if(this.dungeon != null)	keyused = keyused || this.dungeon.readInput(inputobj);
	}
	return keyused;
};

GAMEMODEL.randomInt = function(a,b)
{
	var c = Math.floor(  Math.random()*(b-a+1)  )+a;
	if(c > b)	c = b;
	return c;
};
GAMEMODEL.randomFloat = function(a,b)
{
	var c = (Math.random()*(b-a))+a;
	return c;
};


GAMEMODEL.fetchCamera = function(id)
{
	if(this.generator != null && this.generator.generatorAPI != null && this.generator.generatorAPI.genCamera != null)
	{
		return this.generator.generatorAPI.genCamera;
	}
	else if(this.dungeon != null && this.dungeon.dungeonAPI != null && this.dungeon.dungeonAPI.dunCamera != null)
	{
		return this.dungeon.dungeonAPI.dunCamera;
	}
	else if(this.gameCamera != null)		return this.gameCamera;		/**/
	return this.gameCamera;
};
GAMEMODEL.changeGenerator = function(num)
{
	if(this.generationNum != num)
	{
		if(this.generator != null)	this.generator.close();
		if(this.dungeon != null)	this.dungeon.close();
		this.generator = null;
		this.dungeon = null;
	
		this.generationNum = num;
		this.buildGenerator();
	}
	else
	{
		
	}
};

GAMEMODEL.startGame = function()
{
			console.log("startgame");
	this.gameClock.restart();
	this.gameMode = "GAME_RUN";
	
	GAMEMODEL.buildMaze();
};
GAMEMODEL.buildGenerator = function()
{
	var d = -1;
	var g = -1;
	if(this.dungeon  == null)									d = 0;
	else if(this.dungeon instanceof DSpreadTree.Dungeon)		d = 1;
	else if(this.dungeon instanceof DSepSteer.Dungeon)			d = 2;
	if(this.generator  == null)									g = 0;
	else if(this.generator instanceof GSepSteer.Generator)		g = 1;
	else if(this.generator instanceof GSepSteer.Generator)		g = 2;
	
	
	switch(this.generationNum)
	{
		case 1:
			if(g != 1)		this.generator = GSpreadTree.Generator.alloc();
			else			{ this.generator.close(); this.generator.init(); }
			if(d != 1)		this.dungeon = DSpreadTree.Dungeon.alloc();
			else			{ this.dungeon.close(); this.dungeon.init(); }
			break;
		case 2:
			if(g != 2)		this.generator = GSepSteer.Generator.alloc();
			else			{ this.generator.close(); this.generator.init(); }
			if(d != 2)		this.dungeon = DSepSteer.Dungeon.alloc();
			else			{ this.dungeon.close(); this.dungeon.init(); }
			break;
		default:
			if(this.generator != null)	this.generator.close();
			if(this.dungeon != null)	this.dungeon.close();
			this.generator = null;
			this.dungeon = null;
			break;
	}
};
GAMEMODEL.buildMaze = function()
{
	console.log("a");
	this.buildGenerator();
	console.log("b");
	if(this.generator != null)	this.generator.beginMaze();
	console.log("c");
};

GAMEMODEL.togglePause = function()
{
	if(this.gameMode === "GAME_PAUSE")
	{
		this.gameClock.start();
		this.gameMode = "GAME_RUN";
	}
	else if(this.gameMode === "GAME_RUN")
	{
		this.gameClock.stop();
		this.gameMode = "GAME_PAUSE";
	}
};



GAMEMODEL.distributeInput = function(inobj)
{
	var keyused = false;
	keyused = keyused || this.readInput(inobj)
	if(this.gameMode === "GAME_RUN")
	{
		for(var i in this.gamePlayers)
		{
			keyused = keyused || this.gamePlayers[i].readInput(inobj);
		}
	}
	return keyused;
};
GAMEMODEL.updateAll = function()
{
	if(this.gameMode === "GAME_RUN")
	{
		this.activeObjs = 0;
		
		if(this.generator != null)		this.generator.update();
		if(this.dungeon != null)		this.dungeon.update();
		
		for(var i in this.gameAreas)
		{
			this.gameAreas[i].update();
	
			this.activeObjs += this.gameAreas[i].activeActors.length;
		}
		if(this.gameCamera != null)	
		{
			this.gameCamera.updatePosition( this.gamePlayers[0].absPosition );
			this.gameCamera.update();
		}
	}
	else if(this.gameClock.isActive == true)
	{
		if(this.gameMode === "GAME_PAUSE")		this.gameClock.stop();
		if(this.gameMode === "GAME_MUSICPAUSE")	this.gameClock.stop();
	}
};
GAMEMODEL.collideAll = function()
{
	if(this.gameMode === "GAME_RUN")
	{
		for(var i in this.gameAreas)
		{
			this.gameAreas[i].collide();
		}
	}
};




GAMEMODEL.drawAll = function()
{
	for(var i in this.gameAreas)
	{
		this.gameAreas[i].draw();
	}

	if(this.generator != null)			this.generator.draw();
	else if(this.dungeon != null)		this.dungeon.draw();
	
	for(var i in this.gamePlayers)
	{
//		this.gamePlayers[i].draw();
	}
};
/**/