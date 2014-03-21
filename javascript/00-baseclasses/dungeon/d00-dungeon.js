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

var BaseDung00 = BaseDung00 || {};

BaseDung00.Dungeon = function() {}
BaseDung00.Dungeon.prototype.identity = function() {
	return ('BaseDung00.Dungeon ()');
};
BaseDung00.Dungeon.prototype.init = function() {
//	this.dungeonView = BaseDung00.DungeonView.alloc();
//	this.dungeonAPI = BaseDung00.DungeonAPI.alloc();
	this.dungeonView = null;
	this.dungeonAPI = null;
	
	this.dungeonMap = null;
};
BaseDung00.Dungeon.prototype.close = function() {
	if(this.dungeonView != null)	this.dungeonAPI.close();
	if(this.dungeonAPI != null)		this.dungeonAPI.close();
//	if(this.dungeonMap != null)		this.dungeonMap.close();

	this.dungeonView = null;
	this.dungeonAPI = null;
	
	this.dungeonMap = null;
};

BaseDung00.Dungeon.prototype.readInput = function(inputobj)
{
	var keyused = false;
	if(this.dungeonAPI != null)	keyused = keyused || this.dungeonAPI.readInput(inputobj);
	return keyused;
};

BaseDung00.Dungeon.prototype.update = function() {
	if(this.dungeonAPI != null)		this.dungeonAPI.update();
	if(this.dungeonMap != null)		this.dungeonMap.update();
};
BaseDung00.Dungeon.prototype.draw = function() {
	if(this.dungeonAPI != null)		this.dungeonAPI.draw();
	if(this.dungeonMap != null)		this.dungeonMap.draw();
};
BaseDung00.Dungeon.alloc = function() {
	var vc = new BaseDung00.Dungeon();
	vc.init();
	return vc;
};


