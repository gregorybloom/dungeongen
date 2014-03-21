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

var Dung02 = Dung02 || {};
Dung02.SeparateSteer = Dung02.SeparateSteer || {};

var DSepSteer = namespaceFn('Dung02.SeparateSteer');


DSepSteer.DungeonGrid = function() {}
DSepSteer.DungeonGrid.prototype = new Actor;
DSepSteer.DungeonGrid.prototype.identity = function() {
	return ('Dung02.SeparateSteer.DungeonGrid (' +this._dom.id+ ')');
};
DSepSteer.DungeonGrid.prototype.init = function() {
	Actor.prototype.init.call(this);

	this.baseRooms = {};

	this.gridSize = {w:GAMEMODEL.generator.floorSize.w, h:GAMEMODEL.generator.floorSize.h};
	this.tileSize = {w:40, h:40};

	this.startTile = {x:-1,y:-1};
//	this.totalHeight = 10;
};

DSepSteer.DungeonGrid.prototype.update = function() {
	Actor.prototype.update.call(this);	
	for(var i in this.baseRooms)
	{
		this.baseRooms[i].update();
	}
};
DSepSteer.DungeonGrid.prototype.draw = function() {
//	Actor.prototype.draw.call(this);
	
	for(var i in this.baseRooms)
	{
		this.baseRooms[i].draw();
	}
};
DSepSteer.DungeonGrid.alloc = function() {
	var vc = new DSepSteer.DungeonGrid();
	vc.init();
	return vc;
};



DSepSteer.BaseRoom = function() {}
DSepSteer.BaseRoom.prototype = new Actor;
DSepSteer.BaseRoom.prototype.identity = function() {
	return ('Dung02.SeparateSteer.BaseRoom (' +this._dom.id+ ')');
};
DSepSteer.BaseRoom.prototype.init = function() {
	Actor.prototype.init.call(this);
	
	this.parentGrid = null;
	
	this.gridSize = {w:0,h:0};
	this.tileSize = {w:40, h:40};
	
	this.tileCoord = {x:0,y:0};
	
	this.tileGrid = {};
};

DSepSteer.BaseRoom.prototype.setGrid = function(X,Y,W,H) {
//										console.log("-- X,Y: "+X+", " +Y ); 
	this.gridSize.w = W;
	this.gridSize.h = H;
	this.tileCoord.x = X;
	this.tileCoord.y = Y;
	this.size.w = this.tileSize.w * this.gridSize.w;
	this.size.h = this.tileSize.h * this.gridSize.h;
	
	for(var i=0; i<this.gridSize.w; i++)
	{
		this.tileGrid[i] = {};
		for(var j=0; j<this.gridSize.h; j++)
		{
			this.tileGrid[i][j] = DSepSteer.TileGrid.alloc();
			this.tileGrid[i][j].point = {i:i,j:j,h:0};
			
			if(i==0 || i==(this.gridSize.w-1) || j==0 || j==(this.gridSize.h-1))
			{
				this.tileGrid[i][j].fill();
			}
		}		
	}

	var newpos = {x:0,y:0};
	if(this.parentGrid != null)		newpos.x = this.parentGrid.tileSize.w * this.tileCoord.x;
	if(this.parentGrid != null)		newpos.y = this.parentGrid.tileSize.h * this.tileCoord.y;
	if(this.parentGrid != null)		newpos.x = newpos.x - this.parentGrid.size.w/2;
	if(this.parentGrid != null)		newpos.y = newpos.y - this.parentGrid.size.h/2;
//										console.log("-- update: " + JSON.stringify(newpos) ); 

	
	this.updatePosition(newpos);
};

DSepSteer.BaseRoom.prototype.update = function() {
	Actor.prototype.update.call(this);	
};
DSepSteer.BaseRoom.prototype.draw = function() {
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
		else if(tile.filled && !tile.visited)		drawC = {r:0,g:0,b:0};
		else if(tile.filled && tile.visited)		drawC = {r:75,g:75,b:75};
		else if(!tile.filled && tile.visited)		drawC = {r:255,g:255,b:255};
		else										drawC = {r:255,g:0,b:0};
/**/				
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
			drawTile(this,i,j);
//			else if(tile.stairsDown || tile.stairsUp)			drawTile(this,i,j);
		}
	}
	
//	console.log(start_x +":" + end_x + "  =  " +start_y +":" + end_y);
	
	
//	GAMEVIEW.drawBox(null, this.absBox, "blue");
};


DSepSteer.BaseRoom.alloc = function() {
	var vc = new DSepSteer.BaseRoom();
	vc.init();
	return vc;
};




DSepSteer.TileGrid = function() {}
DSepSteer.TileGrid.prototype.identity = function() {
	return ('Dung02.SeparateSteer.TileGrid ()');
};
DSepSteer.TileGrid.prototype.init = function() {
	
	this.point = {i:0,J:0,h:0};
	this.visited = false;
	this.filled = true;
	this.hotspot = false;
	this.roomHotspot = false;
	
	this.stairsDown = false;
	this.stairsUp = false;
	
	this.hotDir = -1;
};

DSepSteer.TileGrid.prototype.dig = function() {
	this.filled = false;
	this.visited = true;
	if(this.hotspot)
	{
		GAMEGEOM.removeValue( GAMEMODEL.generator.hotspots,{x:this.point.i,y:this.point.j} );
		this.hotspot = false;
	}
};
DSepSteer.TileGrid.prototype.fill = function() {
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
DSepSteer.TileGrid.prototype.makeHotspot = function(d,l) {
	this.hotDir = d;
	this.roomHotspot = l;
	this.hotspot = true;
};
DSepSteer.TileGrid.prototype.makeStairsUp = function() {
	this.stairsDown = false;
	this.stairsUp = true;
};
DSepSteer.TileGrid.prototype.makeStairsDown = function() {
	this.stairsUp = false;
	this.stairsDown = true;
};

DSepSteer.TileGrid.alloc = function() {
	var vc = new DSepSteer.TileGrid();
	vc.init();
	return vc;
};
/**/
