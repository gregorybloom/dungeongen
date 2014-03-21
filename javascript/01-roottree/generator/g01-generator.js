var DSpreadTree = namespaceFn('Dung01.SpreadTree');

var Gen01 = Gen01 || {};
Gen01.SpreadTree = Gen01.SpreadTree || {};

var GSpreadTree = namespaceFn('Gen01.SpreadTree');


GSpreadTree.Generator = function() {}
GSpreadTree.Generator.prototype = new BaseGen00.Generator;
GSpreadTree.Generator.prototype.identity = function() {
	return ('Gen01.SpreadTree.Generator (' +this._dom.id+ ')');
};

GSpreadTree.Generator.prototype.init = function() {
	BaseGen00.Generator.prototype.init.call(this);
		
	this.floorSize = {w:150,h:150};
	this.tileSize = 40;
	
	this.viewHeight = 0;
	this.currentHeight = 0;
	this.spotCounter = 0;
	this.totalSpotCounter = 0;
	
	this.roomPercent = 0.3;
	
	this.minRoomSize = {w:2,h:2};
	this.maxRoomSize = {w:11,h:11};
	
	this.hallRangeSize = {x:3,y:10};
	
	this.minSpots = 100;
	this.maxSpots = 1000;
	
	this.hotspots = [];
	this.goingDown = [];
		
	this.dungeonMap = null;
	
	this.autofocus = false;



	this.autostep = true;	
	this.stepTime = 150;

	this.genToolkit = GSpreadTree.GeneratorKit.alloc();
	this.generatorAPI = GSpreadTree.GeneratorAPI.alloc();
	this.roomBuilder = GSpreadTree.RoomBuilder.alloc();
	this.genToolkit.generator = this;
	this.generatorAPI.generator = this;
	this.roomBuilder.generator = this;
};

GSpreadTree.Generator.prototype.close = function()
{
	this.hotspots = [];
	this.goingDown = [];

	if(this.genToolkit != null)		this.genToolkit.close();
	if(this.roomBuilder != null)	this.roomBuilder.close();
	this.genToolkit = null;
	this.roomBuilder = null;
	
	BaseGen00.Generator.prototype.close.call(this);
};
GSpreadTree.Generator.prototype.update = function()
{
	BaseGen00.Generator.prototype.update.call(this);
};



GSpreadTree.Generator.prototype.beginMaze = function() {
	
	this.begin = true;
	
	// initialize dungeon
	var xDung = DSpreadTree.DungeonGrid.alloc();
	xDung.updatePosition({x:0,y:0});
	this.dungeonMap = xDung;

	var xGrid = DSpreadTree.FloorGrid.alloc();
	xGrid.updatePosition({x:0,y:0});
	xGrid.setGrid(this.floorSize.w,this.floorSize.h);

	xDung.floors[0] = xGrid;
	xDung.size.w = xGrid.size.w;
	xDung.size.h = xGrid.size.h;

	GAMEMODEL.gameAreas[0].size = {w:xDung.size.w,h:xDung.size.h};
	GAMEMODEL.gameAreas[0].updatePosition({x:0,y:0});

	//	select point to dig into maze block
	var startingSide = GAMEMODEL.randomInt(0,3);
	var along_x=0;
	var along_y=0;
	
	var h = this.viewHeight;
	
	switch(startingSide)
	{
		case 0:
			along_x = 2 + GAMEMODEL.randomInt(0,this.dungeonMap.floors[h].gridSize.w-3-2);
			along_y = 0;
			break;
		case 1:
			along_x = this.dungeonMap.floors[h].gridSize.w-1;
			along_y = 2 + GAMEMODEL.randomInt(0,this.dungeonMap.floors[h].gridSize.h-3-2);
			break;
		case 2:
			along_x = 2 + GAMEMODEL.randomInt(0,this.dungeonMap.floors[h].gridSize.w-3-2);
			along_y = this.dungeonMap.floors[h].gridSize.h-1;
			break;
		case 3:
			along_x = 0;
			along_y = 2 + GAMEMODEL.randomInt(0,this.dungeonMap.floors[h].gridSize.h-3-2);
			break;
	}

	// set starting tiles and begin starting parametres
	var startingPt = {x:along_x,y:along_y};
	var startingDir = (startingSide + 2)%4;
	this.dungeonMap.startTile = {x:startingPt.x,y:startingPt.y};
	
	var getLength = 4;
	var digPoint = {x:startingPt.x,y:startingPt.y};
	var sideStep = {x:digPoint.x,y:digPoint.y};
	
	// begin to dig out hallway
	var mainDir = startingDir;
	var lookTowards = mainDir;
	var countSteps = 0;
	this.currentHeight = 0;
	
	while(countSteps < getLength)
	{
		// dig hall space
		var tile = this.dungeonMap.floors[h].tileGrid[digPoint.x][digPoint.y];
		tile.dig();
		
		// fill hallway walls. look to one side, step to the side, grab the file. fill it. turn the other way, repeat.
		if(countSteps < 4)
		{
			lookTowards = (mainDir+1)%4;
			sideStep = {x:digPoint.x+this.genToolkit.moveTrans[lookTowards].x,y:digPoint.y+this.genToolkit.moveTrans[lookTowards].y};
			tile = this.dungeonMap.floors[h].tileGrid[sideStep.x][sideStep.y];
			tile.fill();
			lookTowards = (mainDir-1)%4;
			if(lookTowards < 0)		lookTowards += 4;

			sideStep = {x:digPoint.x+this.genToolkit.moveTrans[lookTowards].x,y:digPoint.y+this.genToolkit.moveTrans[lookTowards].y};
			tile = this.dungeonMap.floors[h].tileGrid[sideStep.x][sideStep.y];
			tile.fill();
		}
		digPoint = {x:(digPoint.x+this.genToolkit.moveTrans[mainDir].x),y:(digPoint.y+this.genToolkit.moveTrans[mainDir].y)};
		countSteps++;
	}
	
	//	generate remaining floors
	for(var i=1; i<this.dungeonMap.totalHeight; i++)
	{
		this.viewHeight = i;

		var xGrid = DSpreadTree.FloorGrid.alloc();
		xGrid.updatePosition({x:0,y:0});
		xGrid.setGrid(this.floorSize.w,this.floorSize.h);

		xDung.floors[i] = xGrid;
	}
	this.viewHeight = 0;
	
	//	fills in border of floors
	for(var H=0; H<this.dungeonMap.totalHeight; H++)
	{
		for(var a=0; a<this.dungeonMap.floors[H].gridSize.w; a++)
		{
			var tileRow = this.dungeonMap.floors[H].tileGrid[a];
			var highCol = this.dungeonMap.floors[H].gridSize.h-1;
			if(!tileRow[0].visited)				tileRow[0].fill();
			if(!tileRow[highCol].visited)		tileRow[highCol].fill();
		}
		for(var b=0; b<this.dungeonMap.floors[H].gridSize.h; b++)
		{
			var tileCol = this.dungeonMap.floors[H].tileGrid;
			var highRow = this.dungeonMap.floors[H].gridSize.w-1;
			if(!tileCol[0][b].visited)			tileCol[0][b].fill();
			if(!tileCol[highRow][b].visited)	tileCol[highRow][b].fill();
		}
	}
	
	
	this.hotspots = [];
	this.goingDown = [];

	lookTowards = (  mainDir + GAMEMODEL.randomInt(-1,1)  )%4;
	if(lookTowards < 0)		lookTowards += 4;
	
	this.genToolkit.setHotspot( digPoint, -1, false, h );
	
	
	var focusPt = {x:0,y:0};
//	focusPt.x = startingPt.x*this.tileSize;
//	focusPt.y = startingPt.y*this.tileSize;
	focusPt.x = this.floorSize.w*this.tileSize/2;
	focusPt.y = this.floorSize.h*this.tileSize/2;
	GAMEMODEL.gamePlayers[0].updatePosition(focusPt);

	/*
	var stepForward = GAMEMODEL.randomInt(4,10);
	var digPt2 = {x:digPoint.x,y:digPoint.y};
	digPt2.x += stepForward*this.moveTrans[startingDir].x;
	digPt2.y += stepForward*this.moveTrans[startingDir].y;
//	this.roomBuilder.buildArea(digPoint, digPt2, heightCounter);
	
	maxSpots = this.dungeonMap.totalHeight*this.dungeonMap.floors[heightCounter].gridSize.w;
	maxSpots = (maxSpots*this.dungeonMap.floors[heightCounter].gridSize.h)/10;
	
	var thisDir = 0;
	var randSeed = 0.0;
	var target = {x:0,y:0};
	var thisSpot = {x:0,y:0};
	var spotCounter = 0;
	var heightCounter = 0;
	/**/	
};


GSpreadTree.Generator.prototype.buildNextSpot = function() {
	
	if(this.begin == false || this.finished == true)	return;
	
	console.log(" ***** Next step *****");
//	console.log(  JSON.stringify(this.hotspots)  );
	
	if(this.hotspots.length>0 && this.spotCounter <= this.maxSpots)
	{
		thisSpot = this.hotspots[0];
		target = {x:thisSpot.x,y:thisSpot.y};
		GAMEGEOM.removeValue(this.hotspots, thisSpot);
		
		if(this.autostep || this.autofocus)	this.generatorAPI.reframeCameraToCoord(null, target, this.currentHeight);

		
		randSeed = Math.random();
		var cur = this.dungeonMap.floors[this.currentHeight].tileGrid[target.x][target.y];
//			cur.update();
							console.log("spot: "+ JSON.stringify(target)+", "+this.currentHeight +" = "+cur.hotspot );
		if(cur.hotspot && randSeed <= this.roomPercent)
		{
					console.log("building room");
//			thisDir = cur.hotDir;
			thisDir = this.genToolkit.getClearDirection(this.currentHeight,target);
//							console.log("this dir: "+thisDir);
//			if(thisDir == -1)		thisDir = this.genToolkit.getClearDirection(this.currentHeight,target);
			if(thisDir == -1)		
			{
				cur.fill();
			}
			else
			{
				var v = {x:(target.x+this.genToolkit.moveTrans[thisDir].x),y:(target.y+this.genToolkit.moveTrans[thisDir].y)};
				var roomList = this.genToolkit.getAllAreas(v,thisDir,this.currentHeight);
				if(roomList.length > 0)
				{
					cur.dig();
					var randBox = GAMEMODEL.randomInt(0, roomList.length-1);
					var roomBox = roomList[randBox];
					var roomPos = {x:roomBox.x,y:roomBox.y};
					var roomPos2 = {x:(roomBox.x+roomBox.w-1),y:(roomBox.y+roomBox.h-1)};
					
					this.roomBuilder.buildArea(roomPos,roomPos2,this.currentHeight);
				}
				else
				{
					cur.fill();
				}
			}
		}
		else if(cur.hotspot)
		{
							console.log("building hall");
			thisDir = cur.hotDir;
			if(thisDir == -1)		thisDir = this.genToolkit.getClearDirection(this.currentHeight,target);
			if(thisDir == -1)		
			{
				cur.fill();
				return;
			}

			var maxDist = this.genToolkit.getOpenDistance(target, thisDir, this.currentHeight) -1;
			if(maxDist >1)
			{
				var dist = GAMEMODEL.randomInt(2,maxDist);
				var target2 = {x:target.x,y:target.y};
				target2.x += dist*this.genToolkit.moveTrans[thisDir].x;
				target2.y += dist*this.genToolkit.moveTrans[thisDir].y;

				this.roomBuilder.buildArea(target,target2,this.currentHeight);				
			}
			else
			{
				cur.fill();
			}
			
		}
		
		//	if used hotspot still has open directions, place a new hotspot on unvisited directions?
		// or maintain current hotspot?
		var remaindir = this.genToolkit.getClearDirection(this.currentHeight,target);
		if(  remaindir != -1 && !cur.filled  )
		{
			this.genToolkit.setHotspot(target, -1, cur.roomHotspot, this.currentHeight);
//			this.genToolkit.setHotspot(v2, -1, false, this.currentHeight);
			for(var i=0; i<4; i++)
			{
				var v2 = {x:(target.x+this.genToolkit.moveTrans[i].x),y:(target.y+this.genToolkit.moveTrans[i].y)};
				if(  this.genToolkit.isInRange(v2, this.currentHeight)  )
				{
					var tile = this.dungeonMap.floors[this.currentHeight].tileGrid[v2.x][v2.y];
					if(!tile.visited)		this.genToolkit.setHotspot(v2, -1, false, this.currentHeight)		
				}		
			}

		}
		
//		console.log("count: " + this.spotCounter);
		this.spotCounter++;
		this.totalSpotCounter++;
	}
	
//							console.log("hotspots left: " +this.hotspots.length  );
	if(this.hotspots.length==0)
	{
		while(this.goingDown.length>0)
		{
			var newHotspot = {x:this.goingDown[0].x,y:this.goingDown[0].y};
			if(this.currentHeight+1 < this.dungeonMap.totalHeight)
			{
				var cur = this.dungeonMap.floors[this.currentHeight+1].tileGrid[newHotspot.x][newHotspot.y];
				cur.makeHotspot(-1, false);
			}
			this.hotspots.push(  newHotspot  );
			this.goingDown.splice(0,1);
		}
		this.currentHeight++;
		this.spotCounter = 0;
		
		if(this.currentHeight == this.dungeonMap.totalHeight || this.hotspots.length == 0)
		{
			if(this.totalSpotCounter > this.minSpots)
			{
				this.complete();
			}
			else
			{
				this.init();
				this.beginMaze();
			}
		}
	}
//	heightCounter++;
	/**/
};

GSpreadTree.Generator.prototype.complete = function() {
	GAMEMODEL.dungeon.viewHeight = this.viewHeight;

	GAMEMODEL.dungeon.dungeonMap = this.dungeonMap;
	GAMEMODEL.dungeon.dungeonAPI.dunCamera = this.generatorAPI.genCamera;
	
	this.finished = true;
	this.close();
	GAMEMODEL.generator = null;	
};
GSpreadTree.Generator.alloc = function() {
	var vc = new GSpreadTree.Generator();
	vc.init();
	return vc;
};


