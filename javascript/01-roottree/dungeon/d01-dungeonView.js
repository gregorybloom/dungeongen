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

DSpreadTree.DungeonView = function() {}
DSpreadTree.DungeonView.prototype = new BaseDung00.DungeonView;
DSpreadTree.DungeonView.prototype.identity = function() {
	return ('Dung01.SpreadTree.DungeonView (' +this._dom.id+ ')');
};
DSpreadTree.DungeonView.prototype.init = function() {
	BaseDung00.DungeonView.prototype.init.call(this);

};

DSpreadTree.DungeonView.alloc = function() {
	var vc = new DSpreadTree.DungeonView();
	vc.init();
	return vc;
};


