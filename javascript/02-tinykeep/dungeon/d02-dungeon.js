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


DSepSteer.Dungeon = function() {}
DSepSteer.Dungeon.prototype = new BaseDung00.Dungeon;
DSepSteer.Dungeon.prototype.identity = function() {
	return ('Dung02.SeparateSteer.Dungeon (' +this._dom.id+ ')');
};
DSepSteer.Dungeon.prototype.init = function() {
	this.viewHeight = 0;
	
	this.dungeonView = DSepSteer.DungeonView.alloc();
	this.dungeonAPI = DSepSteer.DungeonAPI.alloc();
	
	this.dungeonMap = DSepSteer.DungeonGrid.alloc();
};
DSepSteer.Dungeon.prototype.close = function() {
	BaseDung00.Dungeon.prototype.close.call(this);
};

DSepSteer.Dungeon.alloc = function() {
	var vc = new DSepSteer.Dungeon();
	vc.init();
	return vc;
};


