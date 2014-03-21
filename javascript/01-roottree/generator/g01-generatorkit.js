var Gen01 = Gen01 || {};
Gen01.SpreadTree = Gen01.SpreadTree || {};

var GSpreadTree = namespaceFn('Gen01.SpreadTree');


GSpreadTree.GeneratorKit = function() {}
GSpreadTree.GeneratorKit.prototype.identity = function() {
	return ('Gen01.SpreadTree.GeneratorKit ()');
};
GSpreadTree.GeneratorKit.prototype.init = function() {
	this.generator = null;
	
	this.moveTrans = [ {x:0,y:-1},{x:1,y:0},{x:0,y:1},{x:-1,y:0} ];	
};
GSpreadTree.GeneratorKit.prototype.close = function() {
	this.generator = null;

	this.moveTrans = null;
};

GSpreadTree.GeneratorKit.prototype.getClearDirection = function(height, point) {
	for(var i=0; i<4; i++)
	{
		var newpt = {x:0,y:0};
		newpt.x = this.moveTrans[i].x + point.x;
		newpt.y = this.moveTrans[i].y + point.y;
		if(  this.isInRange(newpt, height)  )
		{
			var tile = this.generator.dungeonMap.floors[height].tileGrid[newpt.x][newpt.y];
			if(!tile.visited)	return i;			
		}		
	}
	return -1;
};

GSpreadTree.GeneratorKit.prototype.setDescending = function(randomPoint, height) {
	var dirList = this.getOpenDirections(randomPoint, height+1);
	
	if(dirList.length > 0)
	{
		this.generator.dungeonMap.floors[height].tileGrid[randomPoint.x][randomPoint.y].makeStairsDown();
		this.generator.dungeonMap.floors[height+1].tileGrid[randomPoint.x][randomPoint.y].makeStairsUp();
		
		var dir = GAMEMODEL.randomInt(0,dirList.length-1);
//		this.setHotspot( randomPoint, dir, false, height+1 );
		this.generator.goingDown.push({x:randomPoint.x,y:randomPoint.y});
	}
};

GSpreadTree.GeneratorKit.prototype.setHotspot = function(randomPoint, dir, room, height) {
	var logic = false;
	for(var spot in this.generator.hotspots)
	{
		if( this.generator.hotspots[spot].x == randomPoint.x && this.generator.hotspots[spot].y == randomPoint.y  )	
		{
			logic = true;
		}
	}
	
	var tile = this.generator.dungeonMap.floors[height].tileGrid[randomPoint.x][randomPoint.y];
	if(tile.visited)		logic = true;
	if(logic == false)
	{
		tile.makeHotspot(dir, room);
		this.generator.hotspots.push({x:randomPoint.x,y:randomPoint.y});
	}	
};


GSpreadTree.GeneratorKit.prototype.isInRange = function(point, height) {
	var logical = true;
	if(point.x < 0 || point.y < 0)		logical = false;
	if(point.x >= this.generator.dungeonMap.floors[height].gridSize.w)		logical = false;
	if(point.y >= this.generator.dungeonMap.floors[height].gridSize.h)		logical = false;
	if(height < 0 || height >= this.generator.dungeonMap.totalHeight)		logical = false;
	return true;
};


GSpreadTree.GeneratorKit.prototype.overlapsVisited = function(box, height) {
	var startPt = {x:box.x,y:box.y};
	var endPt = {x:(box.x+box.w),y:(box.y+box.h)};
	for(var i=startPt.x; i<=endPt.x; i++)
	{
		for(var j=startPt.y; j<=endPt.y; j++)
		{
			if( i<0 || j < 0)		return true;
			if(i>=this.generator.dungeonMap.floors[height].gridSize.w || j>=this.generator.dungeonMap.floors[height].gridSize.h)
			{
				return true;
			}
			var tile = this.generator.dungeonMap.floors[height].tileGrid[i][j];
			if(tile.visited)		return true;
		}		
	}
	return false;
};
GSpreadTree.GeneratorKit.prototype.getOpenDirections = function(point, height) {
	var dirList = [];
	var targetV = {x:0,y:0};
	
	for(var d=0; d<4; d++)
	{
		targetV.x = point.x + this.moveTrans[d].x;
		targetV.y = point.y + this.moveTrans[d].y;
		var getThis = false;
		getThis = getThis || targetV.x<0 || targetV.y<0;
		getThis = getThis || targetV.x >= this.generator.dungeonMap.floors[height].gridSize.w;
		getThis = getThis || targetV.y >= this.generator.dungeonMap.floors[height].gridSize.h;
		if(getThis)
		{
			targetV = {x:point.x,y:point.y};
		}
		else if(this.generator.dungeonMap.floors[height].tileGrid[targetV.x][targetV.y].hotspot)
		{
			dirList = [];
			return dirList;
		}
		else if(!this.generator.dungeonMap.floors[height].tileGrid[targetV.x][targetV.y].visited)
		{
			dirList.push(d);
		}
	}
	return dirList;
};
GSpreadTree.GeneratorKit.prototype.getOpenAreas = function(point, size, dir, h) {
	var boxList = [];
	var topLeft = {x:0,y:0};
	var steps = {x:0,y:0};
	var totalSteps = 0;
	
	if(dir == 0)	topLeft = {x:point.x,y:(point.y-size.h+1)};
	if(dir == 1)	topLeft = {x:point.x,y:(point.y-size.h+1)};
	if(dir == 2)	topLeft = {x:point.x,y:point.y};
	if(dir == 3)	topLeft = {x:(point.x-size.w+1),y:point.y};
	
	if(dir == 0)	steps = {x:-1,y:0};
	if(dir == 1)	steps = {x:0,y:1};
	if(dir == 2)	steps = {x:-1,y:0};
	if(dir == 3)	steps = {x:0,y:-1};
	
	totalSteps = {x:steps.x*size.w,y:steps.y*size.h};
	totalSteps = Math.sqrt( totalSteps.x*totalSteps.x +totalSteps.y*totalSteps.y);

	var count = 0;
	var boxPos = {x:0,y:0};
	while(count < totalSteps)
	{
		boxPos = {x:topLeft.x+count*steps.x,y:topLeft.y+count*steps.y};
		var b = {x:boxPos.x,y:boxPos.y,w:size.w,h:size.h};
//						console.log(  count+": " + JSON.stringify(b) );
		if(!this.overlapsVisited(b,h))		boxList.push(b);
//		if(!this.overlapsVisited(b,h))		console.log(  count+": added, " + JSON.stringify(b) );
		count++;
	}
	return boxList;	
};
GSpreadTree.GeneratorKit.prototype.getAllAreas = function(point, dir, h) {
	var boxList = [];
							console.log("get areas point: "+ JSON.stringify(point) );
							console.log("get areas dir: "+ dir );
	for(var length=this.generator.minRoomSize.w; length<=this.generator.maxRoomSize.w; length++)
	{
		for(var width=this.generator.minRoomSize.h; width<=this.generator.maxRoomSize.h; width++)
		{
			var size={w:length,h:width};
			var tempList = this.getOpenAreas(point, size, dir, h);			
			for(var temp in tempList)
			{
				boxList.push(tempList[temp]);
			}
		}
	}
	return boxList;
}
GSpreadTree.GeneratorKit.prototype.getOpenDistance = function(point, dir, h) {
	var count=0;
	var v = {x:point.x,y:point.y};
					console.log( "get open distance" );
	var tile = this.generator.dungeonMap.floors[h].tileGrid[v.x][v.y];
	while( this.isInRange(v,h) && !tile.visited && count<=Math.floor(this.generator.hallRangeSize.y) )
	{
		count++;
		v.x = point.x + count*this.moveTrans[dir].x;
		v.y = point.y + count*this.moveTrans[dir].y;
		tile = this.generator.dungeonMap.floors[h].tileGrid[v.x][v.y];
	}
	if(count > Math.floor(this.generator.hallRangeSize.y))	count = Math.floor(this.generator.hallRangeSize.y);
	return count;
};


GSpreadTree.GeneratorKit.alloc = function() {
	var vc = new GSpreadTree.GeneratorKit();
	vc.init();
	return vc;
};

