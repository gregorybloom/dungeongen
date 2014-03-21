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

BaseDung00.DungeonView = function() {}
BaseDung00.DungeonView.prototype.identity = function() {
	return ('BaseDung00.DungeonView ()');
};
BaseDung00.DungeonView.prototype.init = function() {

};

BaseDung00.DungeonView.prototype.update = function() {

};
BaseDung00.DungeonView.prototype.draw = function() {

};
BaseDung00.DungeonView.alloc = function() {
	var vc = new BaseDung00.DungeonView();
	vc.init();
	return vc;
};


