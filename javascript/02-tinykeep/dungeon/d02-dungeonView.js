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

DSepSteer.DungeonView = function() {}
DSepSteer.DungeonView.prototype = new BaseDung00.DungeonView;
DSepSteer.DungeonView.prototype.identity = function() {
	return ('Dung02.SeparateSteer.DungeonView (' +this._dom.id+ ')');
};
DSepSteer.DungeonView.prototype.init = function() {
	BaseDung00.DungeonView.prototype.init.call(this);

};

DSepSteer.DungeonView.alloc = function() {
	var vc = new DSepSteer.DungeonView();
	vc.init();
	return vc;
};


