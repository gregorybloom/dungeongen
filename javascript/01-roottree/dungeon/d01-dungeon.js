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


DSpreadTree.Dungeon = function() {}
DSpreadTree.Dungeon.prototype = new BaseDung00.Dungeon;
DSpreadTree.Dungeon.prototype.identity = function() {
	return ('Dung01.SpreadTree.Dungeon (' +this._dom.id+ ')');
};
DSpreadTree.Dungeon.prototype.init = function() {
	this.viewHeight = 0;
	
	this.dungeonView = DSpreadTree.DungeonView.alloc();
	this.dungeonAPI = DSpreadTree.DungeonAPI.alloc();
	
	this.dungeonMap = DSpreadTree.DungeonGrid.alloc();
};
DSpreadTree.Dungeon.prototype.close = function() {
	BaseDung00.Dungeon.prototype.close.call(this);
};

DSpreadTree.Dungeon.alloc = function() {
	var vc = new DSpreadTree.Dungeon();
	vc.init();
	return vc;
};


