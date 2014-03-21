var DSepSteer = namespaceFn('Dung02.SeparateSteer');

var Gen02 = Gen02 || {};
Gen02.SeparateSteer = Gen02.SeparateSteer || {};

var GSepSteer = namespaceFn('Gen02.SeparateSteer');


GSepSteer.Generator = function() {}
GSepSteer.Generator.prototype = new BaseGen00.Generator;
GSepSteer.Generator.prototype.identity = function() {
	return ('Gen02.SeparateSteer.Generator (' +this._dom.id+ ')');
};

GSepSteer.Generator.prototype.init = function() {
	BaseGen00.Generator.prototype.init.call(this);
		
	this.floorSize = {w:100,h:100};
	this.tileSize = 40;
	
	this.viewHeight = 0;
	this.currentHeight = 0;
	this.spotCounter = 0;
	this.totalSpotCounter = 0;
	
	this.roomPercent = 0.3;
	
	this.minRoomSize = {w:2,h:2};
	this.maxRoomSize = {w:12,h:12};
	this.maxWHRatio = 1.5;
	
	this.roomSet = 150;
	
	this.roomCount = 0;
	
	
	
	
	
	this.hallRangeSize = {x:3,y:10};
	
	this.minSpots = 100;
	this.maxSpots = 1000;
	
	this.hotspots = [];
	this.goingDown = [];
		
	this.dungeonMap = null;
	
	this.autofocus = false;



	this.autostep = true;	
	this.stepTime = 150;

	this.genToolkit = GSepSteer.GeneratorKit.alloc();
	this.generatorAPI = GSepSteer.GeneratorAPI.alloc();
	this.roomBuilder = GSepSteer.RoomBuilder.alloc();
	this.genToolkit.generator = this;
	this.generatorAPI.generator = this;
	this.roomBuilder.generator = this;
};

GSepSteer.Generator.prototype.close = function()
{
	this.hotspots = [];
	this.goingDown = [];

	if(this.genToolkit != null)		this.genToolkit.close();
	if(this.roomBuilder != null)	this.roomBuilder.close();
	this.genToolkit = null;
	this.roomBuilder = null;
	
	BaseGen00.Generator.prototype.close.call(this);
};
GSepSteer.Generator.prototype.update = function()
{
	BaseGen00.Generator.prototype.update.call(this);
	
//	if(this.begin)		console.log(  JSON.stringify(GAMEMODEL.gameAreas[0].absBox)  );
};



GSepSteer.Generator.prototype.beginMaze = function() {
	
	this.begin = true;
	
	// initialize dungeon
	var xDung = DSepSteer.DungeonGrid.alloc();
	xDung.size.w = xDung.tileSize.w*xDung.gridSize.w;
	xDung.size.h = xDung.tileSize.h*xDung.gridSize.h;
	xDung.updatePosition({x:xDung.size.w/2,y:xDung.size.h/2});
	this.dungeonMap = xDung;
	
	console.log(  JSON.stringify(xDung.size)  );

	GAMEMODEL.gameAreas[0].size = {w:xDung.size.w,h:xDung.size.h};
	GAMEMODEL.gameAreas[0].updatePosition({x:-xDung.size.w/2,y:-xDung.size.h/2});

	var focusPt = {x:0,y:0};
//	focusPt.x = xDung.size.w/2;
//	focusPt.y = xDung.size.h/2;
	GAMEMODEL.gamePlayers[0].updatePosition(focusPt);

	this.roomCount = 0;

};


GSepSteer.Generator.prototype.buildNextSpot = function() {
	
	if(this.begin == false || this.complete == true)	return;
	
	console.log(" ***** Next step *****");
//	console.log(  JSON.stringify(this.hotspots)  );
	
	if(this.roomCount < this.roomSet)
	{
						var maxradiusW = (this.dungeonMap.tileSize.w*(this.dungeonMap.gridSize.w-6));
						var maxradiusH = (this.dungeonMap.tileSize.h*(this.dungeonMap.gridSize.h-6));
		var maxradius = Math.min(  maxradiusW/2, maxradiusH/2  );
		var startradius = maxradius*0.4;
//										console.log("maxradius: " + maxradius); 
//										console.log("startradius: " + startradius); 
		
		var xGrid = DSepSteer.BaseRoom.alloc();
		xGrid.parentGrid = this.dungeonMap;
		xGrid.updatePosition({x:0,y:0});
		
		var width = GAMEMODEL.randomInt(  this.minRoomSize.w,  this.maxRoomSize.w  );
		var height = GAMEMODEL.randomInt(  this.minRoomSize.h,  this.maxRoomSize.h  );

		var WorH = GAMEMODEL.randomInt(  0,  1  );
		if(WorH == 0)
		{
			var Hrange = {x:this.minRoomSize.h, y:this.maxRoomSize.h};
			Hrange.x = Math.max(  Hrange.x, Math.ceil(width/this.maxWHRatio)  );
			Hrange.y = Math.min(  Hrange.y, Math.floor(width*this.maxWHRatio), Math.floor(80/width)  );
			height = GAMEMODEL.randomInt(  Hrange.x,  Hrange.y  );
		}
		else if(WorH == 1)
		{
			var Wrange = {x:this.minRoomSize.w, y:this.maxRoomSize.w};
			Wrange.x = Math.max(  Wrange.x, Math.ceil(height/this.maxWHRatio)  );
			Wrange.y = Math.min(  Wrange.y, Math.floor(height*this.maxWHRatio), Math.floor(80/height)  );
			width = GAMEMODEL.randomInt(  Wrange.x,  Wrange.y  );
		}
				
		var roomSize = {w:(width+2),h:(height+2)};
		var roomRadius = Math.sqrt(roomSize.w*roomSize.w + roomSize.h*roomSize.h);
				
//										console.log("roomSize: " + JSON.stringify(roomSize) ); 	
//										console.log("roomRadius: " + roomRadius); 
		var dist = GAMEMODEL.randomFloat( 0,(startradius-roomRadius) );
//										console.log("dist: " + dist); 
		var deg = GAMEMODEL.randomInt( 0, 360 );
//										console.log("deg: " + deg); 
		
//										console.log("cos: " + Math.cos(deg*Math.PI/180) ); 
//										console.log("sin: " + Math.sin(deg*Math.PI/180) ); 
		var posX = dist*Math.cos(deg*Math.PI/180) + this.dungeonMap.size.w/2;
		var posY = dist*Math.sin(deg*Math.PI/180) + this.dungeonMap.size.h/2;
//										console.log("posX: " + posX ); 
//										console.log("posY: " + posY ); 
		
		posX = Math.floor(posX / this.dungeonMap.tileSize.w) - Math.floor(roomSize.w/2);
		posY = Math.floor(posY / this.dungeonMap.tileSize.h) - Math.floor(roomSize.h/2);
//										console.log("posX: " + posX ); 
//										console.log("posY: " + posY ); 
		
		
		xGrid.setGrid(posX,posY,roomSize.w,roomSize.h);
		xGrid.update();
	
		this.dungeonMap.baseRooms[this.roomCount] = xGrid;
		
	
										console.log("count: "+this.roomCount);
		this.roomCount++;	
	}
		
//							console.log("hotspots left: " +this.hotspots.length  );
	if(this.roomCount==this.roomSet)
	{
		this.complete();
	}
//	heightCounter++;
	/**/
};

GSepSteer.Generator.prototype.complete = function() {
//	GAMEMODEL.dungeon.viewHeight = this.viewHeight;

	GAMEMODEL.dungeon.dungeonMap = this.dungeonMap;
	GAMEMODEL.dungeon.dungeonAPI.dunCamera = this.generatorAPI.genCamera;
	
	this.finished = true;
	this.close();
	GAMEMODEL.generator = null;	
};
GSepSteer.Generator.alloc = function() {
	var vc = new GSepSteer.Generator();
	vc.init();
	return vc;
};


