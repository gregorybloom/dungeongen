/*
		tile_data: Array<<Array<<Array<<Location>>>>>>

		grid_size(100,100) : Vector2
		grid_height=10 : Int32
		view_height=0 : Int32
		tile_size(40,40) : Vector2
		
		start_tile(0,0) : Vector2
		
		started=false : Logical
		update_locations=true : Logical
		move_trans={Vector2(0,-1.0),Vector2(1.0,0),Vector2(0,1.0),Vector2(-1.0,0)} : Vector2[]
/**/

var Dung01 = Dung01 || {};
Dung01.SpreadTree = Dung01.SpreadTree || {};

var DSpreadTree = namespaceFn('Dung01.SpreadTree');


DSpreadTree.DungeonGrid = function() {}
DSpreadTree.DungeonGrid.prototype = new Actor;
DSpreadTree.DungeonGrid.prototype.identity = function() {
	return ('Dung01.SpreadTree.DungeonGrid (' +this._dom.id+ ')');
};
DSpreadTree.DungeonGrid.prototype.init = function() {
	Actor.prototype.init.call(this);

	this.floors = {};
	this.startTile = {x:-1,y:-1};
	this.totalHeight = 10;
};
DSpreadTree.DungeonGrid.prototype.close = function() {
	Actor.prototype.close.call(this);

	this.floors = {};
	this.startTile = {x:-1,y:-1};
	this.totalHeight = 10;
};

DSpreadTree.DungeonGrid.prototype.update = function() {
	Actor.prototype.update.call(this);	
	for(var i in this.floors)
	{
		this.floors[i].update();
	}
};
DSpreadTree.DungeonGrid.prototype.draw = function() {
//	Actor.prototype.draw.call(this);
	var viewHeight = 0;
	if(GAMEMODEL.generator != null)		viewHeight = GAMEMODEL.generator.viewHeight;
	else if(GAMEMODEL.dungeon != null)	viewHeight = GAMEMODEL.dungeon.viewHeight;
	
	this.floors[viewHeight].draw();
};
DSpreadTree.DungeonGrid.alloc = function() {
	var vc = new DSpreadTree.DungeonGrid();
	vc.init();
	return vc;
};



DSpreadTree.FloorGrid = function() {}
DSpreadTree.FloorGrid.prototype = new Actor;
DSpreadTree.FloorGrid.prototype.identity = function() {
	return ('Dung01.SpreadTree.FloorGrid (' +this._dom.id+ ')');
};
DSpreadTree.FloorGrid.prototype.init = function() {
	Actor.prototype.init.call(this);
	
	this.gridSize = {w:GAMEMODEL.generator.floorSize.w, h:GAMEMODEL.generator.floorSize.h};
	this.tileSize = {w:40, h:40};
	
	this.tileGrid = {};
	this.height = parseInt( GAMEMODEL.generator.viewHeight );
	
	for(var i=0; i<this.gridSize.w; i++)
	{
		this.tileGrid[i] = {};
		for(var j=0; j<this.gridSize.h; j++)
		{
			this.tileGrid[i][j] = DSpreadTree.TileGrid.alloc();
			this.tileGrid[i][j].point = {i:i,j:j,h:this.height};
		}		
	}
	
};

DSpreadTree.FloorGrid.prototype.setGrid = function(X,Y) {
	this.gridSize.w = X;
	this.gridSize.h = Y;
	this.size.w = this.tileSize.w * this.gridSize.w;
	this.size.h = this.tileSize.h * this.gridSize.h;
	this.updatePosition({x:this.size.w/2,y:this.size.h/2});
};

DSpreadTree.FloorGrid.prototype.update = function() {
	Actor.prototype.update.call(this);	
};
DSpreadTree.FloorGrid.prototype.draw = function() {
//	Actor.prototype.draw.call(this);

	var drawTile = function(context, X, Y)
	{
		var drawC = {r:0,g:0,b:0};
		var drawGrid = {r:125,g:125,b:125, a:175};
		
		var tile = context.tileGrid[X][Y];

		if(tile.hotspot && tile.filled)				drawC = {r:75,g:175,b:75};	
		else if(tile.hotspot && !tile.filled)		drawC = {r:255,g:175,b:175};
		else if(!tile.filled && tile.stairsDown)	drawC = {r:255,g:175,b:0};
		else if(!tile.filled && tile.stairsUp)		drawC = {r:255,g:0,b:255};
//		else if(tile.filled && !tile.visited)		drawC = {r:0,g:0,b:0};
		else if(tile.filled && tile.visited)		drawC = {r:50,g:50,b:50};
		else if(!tile.filled && tile.visited)		drawC = {r:255,g:255,b:255};
		else										drawC = {r:255,g:0,b:0};
				
		drawC.a = 255;
		
		var drawBox = {x:0,y:0,w:0,h:0};
		drawBox.w = context.tileSize.w;
		drawBox.h = context.tileSize.h;
		drawBox.x = context.tileSize.w*X + context.absPosition.x - context.size.w/2;
		drawBox.y = context.tileSize.h*Y + context.absPosition.y - context.size.h/2;

//			console.log(  JSON.stringify(drawBox)  );

		GAMEVIEW.fillBox(null, drawBox, drawC);
		GAMEVIEW.drawBox(null, drawBox, drawGrid);

/*			if(hotspot)
				if(GameWorld.tile_size.x>=20.0)
					local Real64 s = (GameWorld.tile_size.x)/20.0
					SystemFont.scale(s)
					SystemFont.draw(""+hot_dir,position-GameWorld.world_to_screen-GameWorld.tile_size/4.0)
					SystemFont.scale(1.0)
				endIf		
			endIf	/**/		
	};
	

	var actshift = { x:(this.absPosition.x-this.size.w/2), y:(this.absPosition.y-this.size.h/2) };
	var gamecam = GAMEMODEL.fetchCamera();
	var camshift = gamecam.getCameraShift();
	var cambox = gamecam.absBox;


	var start_x = Math.floor( (camshift.x-actshift.x)/this.tileSize.w );
	var start_y = Math.floor( (camshift.y-actshift.y)/this.tileSize.h );
	var end_x = Math.ceil( (camshift.x+cambox.w-actshift.x)/this.tileSize.w );
	var end_y = Math.ceil( (camshift.y+cambox.h-actshift.y)/this.tileSize.h );
	
//	console.log(start_x +":" + end_x + "  =  " +start_y +":" + end_y);
//	console.log(	JSON.stringify(cambox)	);

	GAMEVIEW.fillBox(null, this.absBox, "black");

	start_x = Math.max(0, Math.min(start_x,this.gridSize.w));	
	start_y = Math.max(0, Math.min(start_y,this.gridSize.h));	
	end_x = Math.max(0, Math.min(end_x,this.gridSize.w));	
	end_y = Math.max(0, Math.min(end_y,this.gridSize.h));	

	for(var i=start_x; i<end_x; i++)
	{
		for(var j=start_y; j<end_y; j++)
		{
			var tile = this.tileGrid[i][j];
			if(tile.hotspot || !tile.filled || tile.visited)	drawTile(this,i,j);
//			else if(tile.stairsDown || tile.stairsUp)			drawTile(this,i,j);
		}
	}
	
//	console.log(start_x +":" + end_x + "  =  " +start_y +":" + end_y);
	
	
	GAMEVIEW.drawBox(null, this.absBox, "blue");
};


DSpreadTree.FloorGrid.alloc = function() {
	var vc = new DSpreadTree.FloorGrid();
	vc.init();
	return vc;
};


DSpreadTree.TileGrid = function() {}
DSpreadTree.TileGrid.prototype.identity = function() {
	return ('Dung01.SpreadTree.TileGrid ()');
};
DSpreadTree.TileGrid.prototype.init = function() {
	
	this.point = {i:0,J:0,h:0};
	this.visited = false;
	this.filled = true;
	this.hotspot = false;
	this.roomHotspot = false;
	
	this.stairsDown = false;
	this.stairsUp = false;
	
	this.hotDir = -1;
};

DSpreadTree.TileGrid.prototype.dig = function() {
	this.filled = false;
	this.visited = true;
	if(this.hotspot)
	{
		GAMEGEOM.removeValue( GAMEMODEL.generator.hotspots,{x:this.point.i,y:this.point.j} );
		this.hotspot = false;
	}
};
DSpreadTree.TileGrid.prototype.fill = function() {
	this.filled = true;
	this.visited = true;
	if(this.hotspot)
	{
		GAMEGEOM.removeValue( GAMEMODEL.generator.hotspots,{x:this.point.i,y:this.point.j} );
	}

//				console.log(  "stairs? up: " +this.stairsUp + ", down: "+this.stairsDown  );
	if(this.stairsDown)
	{
		this.stairsDown = false;
		this.filled = false;
		var linkedTile = GAMEMODEL.generator.dungeonMap.floors[(this.point.h+1)].tileGrid[this.point.i][this.point.j];
		linkedTile.fill();
	}
	else if(this.stairsUp)
	{
		this.stairsUp = false;
		var linkedTile = GAMEMODEL.generator.dungeonMap.floors[(this.point.h-1)].tileGrid[this.point.i][this.point.j];
		linkedTile.stairsDown = false;
	}
	this.hotspot = false;
}
DSpreadTree.TileGrid.prototype.makeHotspot = function(d,l) {
	this.hotDir = d;
	this.roomHotspot = l;
	this.hotspot = true;
};
DSpreadTree.TileGrid.prototype.makeStairsUp = function() {
	this.stairsDown = false;
	this.stairsUp = true;
};
DSpreadTree.TileGrid.prototype.makeStairsDown = function() {
	this.stairsUp = false;
	this.stairsDown = true;
};

DSpreadTree.TileGrid.alloc = function() {
	var vc = new DSpreadTree.TileGrid();
	vc.init();
	return vc;
};
