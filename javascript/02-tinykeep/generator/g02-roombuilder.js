
var Gen02 = Gen02 || {};
Gen02.SeparateSteer = Gen02.SeparateSteer || {};

var GSepSteer = namespaceFn('Gen02.SeparateSteer');


GSepSteer.RoomBuilder = function() {}
GSepSteer.RoomBuilder.prototype.identity = function() {
	return ('Gen02.SeparateSteer.RoomBuilder ()');
};
GSepSteer.RoomBuilder.prototype.init = function() {
	this.generator = null;

	this.chForHotspot = [0.15,0.25];
	this.openNearHotspot = 0.4;
	this.openEndCh = 0.95;
	this.descentCh = 0.01;
	
	this.spotsToAdd = [];
	this.pointsToDig = [];
	this.bordersUnvisited = [];
};
GSepSteer.RoomBuilder.prototype.close = function() {
	this.generator = null;
	
	this.spotsToAdd = [];
	this.pointsToDig = [];
	this.bordersUnvisited = [];
};

GSepSteer.RoomBuilder.prototype.openHall = function(target, height) {
	var randSeed = Math.random();
	
	var tileTarget = GAMEMODEL.generator.dungeonMap.floors[height].tileGrid[target.x][target.y];
	if(randSeed <= this.openEndCh && !tileTarget.visited)
	{
		var dirList = GAMEMODEL.generator.getOpenDirections(target, height);
		if(dirList.length > 0)
		{
			this.spotsToAdd.push({x:target.x,y:target.y});
			var dir = GAMEMODEL.randomInt(0,dirList.length-1);
			GAMEMODEL.generator.setHotspot(target, dirList[dir], false, height);
			return true;	
		}
	}
	else if(tileTarget.hotspot)
	{
		tileTarget.dig();
		return true;
	}
	return false;
};

GSepSteer.RoomBuilder.prototype.buildArea = function( start, finish, height )
{
	this.spotsToAdd = [];
	this.pointsToDig = [];
	this.bordersUnvisited = [];
	
	var isRoom = true;
	var hallDir = -1;

	if(!isRoom && start.x<finish.x)			hallDir = 1;
	else if(!isRoom && start.x>finish.x)	hallDir = 3;
	else if(!isRoom && start.y>finish.y)	hallDir = 2;
	else if(!isRoom && start.y<finish.y)	hallDir = 0;
	
	var randSeed = 0.0;
	var cur = GAMEMODEL.generator.dungeonMap.floors[height].tileGrid[start.x][start.y];
	var diff_x = finish.x - start.x;
	var diff_y = finish.y - start.y;
	var x_step = 0;
	var y_step = 0;
	
	if(diff_x != 0)		x_step = diff_x / (Math.abs(diff_x));
	if(diff_y != 0)		y_step = diff_y / (Math.abs(diff_y));
	
	var x_range = {x:0,y:0};
	var y_range = {x:0,y:0};
	if(start.x < finish.x)	x_range = {x:start.x,y:finish.x};
	else					x_range = {x:finish.x,y:start.x};
	if(start.y < finish.y)	y_range = {x:start.y,y:finish.y};
	else					y_range = {x:finish.y,y:start.y};

	for(var xin=0; xin<=Math.abs(diff_x); xin++)
	{
		for(var yin=0; yin<=Math.abs(diff_y); yin++)
		{
			var log = true;
			var shift = {x:0,y:0};
			var target = {x:0,y:0};
			target.x = start.x + xin*x_step;
			target.y = start.y + yin*y_step;

			cur = GAMEMODEL.generator.dungeonMap.floors[height].tileGrid[target.x][target.y];
			if(!cur.visited)		this.pointsToDig.push({x:target.x,y:target.y});
		}
	}

			
	for(v_point in this.pointsToDig)
	{
		var Vpoint = this.pointsToDig[v_point];
		GAMEMODEL.generator.dungeonMap.floors[height].tileGrid[Vpoint.x][Vpoint.y].dig();
	}
//				console.log("total range " + JSON.stringify(x_range) +" : "+JSON.stringify(y_range));
	
	var topLeft = {x:(x_range.x-1),y:(y_range.x-1)};
	var topRight = {x:(x_range.y+1),y:(y_range.x-1)};
	var bottomLeft = {x:(x_range.x-1),y:(y_range.y+1)};
	var bottomRight = {x:(x_range.y+1),y:(y_range.y+1)};
/*				console.log("top left " + JSON.stringify(topLeft));
				console.log("top right " + JSON.stringify(topRight));
				console.log("bottom left " + JSON.stringify(bottomLeft));
				console.log("bottom right " + JSON.stringify(bottomRight));	/**/
	cur = GAMEMODEL.generator.dungeonMap.floors[height].tileGrid[topLeft.x][topLeft.y];
	if(!cur.visited)		cur.fill();
	cur = GAMEMODEL.generator.dungeonMap.floors[height].tileGrid[topRight.x][topRight.y];
	if(!cur.visited)		cur.fill();
	cur = GAMEMODEL.generator.dungeonMap.floors[height].tileGrid[bottomLeft.x][bottomLeft.y];
	if(!cur.visited)		cur.fill();
	cur = GAMEMODEL.generator.dungeonMap.floors[height].tileGrid[bottomRight.x][bottomRight.y];
	if(!cur.visited)		cur.fill();
	
//					assert(topLeft.y <= bottomRight.y, '- RB 120: yin ['+topLeft.y+','+bottomRight.y+']');
	for(var xin=topLeft.x; xin<=bottomRight.x; xin++)
	{
		for(var yin=topLeft.y; yin<=bottomRight.y; yin++)
		{
			cur = GAMEMODEL.generator.dungeonMap.floors[height].tileGrid[xin][yin];
			if(!cur.visited)		this.bordersUnvisited.push( {x:xin,y:yin} );
		}
	}
	if(this.bordersUnvisited.length == 0)	return;
		
	if(height < GAMEMODEL.generator.dungeonMap.totalHeight-1)
	{
		var c = this.pointsToDig.length;
		randSeed = Math.random();
		if(randSeed <= c*this.descentCh)
		{
			c = GAMEMODEL.randomInt(0,this.pointsToDig.length-1);
			this.generator.genToolkit.setDescending(this.pointsToDig[c],height);
		}
	}
	
	
	var i = 0;
	if(isRoom)	i++;
	var hotSpotNum = GAMEMODEL.randomInt(  1, Math.ceil(this.chForHotspot[i]*this.bordersUnvisited.length)  );
	var randomSpotNum = 0;
	var randomPoint = {x:0,y:0};
	var point = {x:0,y:0};
	var dirList = [];
	if(!isRoom)
	{
		var target = {x:(finish.x+x_step),y:(finish.y+y_step)};
		if(  this.openHall(target, height)  )
		{
			hotSpotNum--;
			GAMEGEOM.removeValue( this.bordersUnvisited,target );
		}		
	}
	
	while(hotSpotNum > 0 && this.bordersUnvisited.length > 0)
	{
		randomSpotNum = GAMEMODEL.randomInt(  0,(this.bordersUnvisited.length-1)  );
		randomPoint = this.bordersUnvisited[randomSpotNum];
		
		var tile = GAMEMODEL.generator.dungeonMap.floors[height].tileGrid[randomPoint.x][randomPoint.y];
		if(tile.hotspot)
		{
			randSeed = Math.random();
			if(randSeed <= this.openNearHotspot)
			{
				tile.dig();
			}
			else
			{
				tile.fill();
			}
			GAMEGEOM.removeValue( this.bordersUnvisited,randomPoint );
			continue;
		}
		
		dirList = [];
		dirList = this.generator.genToolkit.getOpenDirections(randomPoint, height);
		if(dirList.length > 0)
		{
			var dir = GAMEMODEL.randomInt( 0, dirList.length-1 );
			hotSpotNum--;
			this.spotsToAdd.push({x:randomPoint.x,y:randomPoint.y});
			this.generator.genToolkit.setHotspot(randomPoint, dirList[dir],isRoom,height);
		}
		else
		{
			var tile = GAMEMODEL.generator.dungeonMap.floors[height].tileGrid[randomPoint.x][randomPoint.y];
			tile.fill();
		}
		GAMEGEOM.removeValue( this.bordersUnvisited,randomPoint );
	}
	
	
	for(var v_point in this.bordersUnvisited)
	{
		var Vpoint = this.bordersUnvisited[v_point];
		var tile = GAMEMODEL.generator.dungeonMap.floors[height].tileGrid[Vpoint.x][Vpoint.y];
		if( !tile.visited )		tile.fill();
	}
	for(var spot in this.spotsToAdd)
	{
		dirList = [];
		dirList = this.generator.genToolkit.getOpenDirections(this.spotsToAdd[spot],height);
		if(dirList.length>0)
		{
			var dir = GAMEMODEL.randomInt(0,dirList.length-1);
			this.generator.genToolkit.setHotspot(this.spotsToAdd[spot], dirList[dir], isRoom, height);
		}
	}
};



GSepSteer.RoomBuilder.alloc = function() {
	var vc = new GSepSteer.RoomBuilder();
	vc.init();
	return vc;
};


