


function GameArea() {
}
GameArea.prototype = new Actor;
GameArea.prototype.identity = function() {
	return ('Actor (' +this._dom.id+ ')');
};
GameArea.prototype.init = function() {
	Actor.prototype.init.call(this);
	
	this.displayActors = [];
	this.passiveActors = [];
	this.activeActors = [];
	
	this.borderBlock = "NESW";
	
	this.baseOffset = {x:0,y:0};
};
GameArea.prototype.start = function() {
};


GameArea.prototype.update = function() {
	Actor.prototype.update.call(this);
	
	for(var i in this.passiveActors)
	{
		this.passiveActors[i].update();
	}
	for(var i in this.activeActors)
	{
		this.activeActors[i].update();
	}
};
GameArea.prototype.draw = function() {
//	Actor.prototype.draw.call(this);

/*	var frame = GAMEANIMATIONS.getAnimationFrame(2, 0, 2);
	var tilesize = {w:16,h:16};
	var tileset = {w:0,h:0};
	tileset.w = Math.ceil(this.size.w / tilesize.w);
	tileset.h = Math.ceil(this.size.h / tilesize.h);
	for(var j=0; j<tileset.h; j++)
	{
		for(var i=0; i<tileset.w; i++)
		{
			var newpos = {x:0,y:0};
			newpos.x = tilesize.w* (0.5+ i);
			newpos.y = tilesize.h* (0.5+ j);
			GAMEVIEW.drawFromAnimationFrame(frame, {x:0,y:0}, newpos, {x:0,y:0}, 0, null);
		}
	}	/**/
	GAMEVIEW.drawBox(null, this.absBox, "blue");

	
	for(var i in this.passiveActors)
	{
		this.passiveActors[i].draw();
	}
	for(var i in this.activeActors)
	{
		this.activeActors[i].draw();
	}
};

GameArea.prototype.collide = function() {
	for(var i in this.activeActors)
	{
		if(  this.collideType(this.activeActors[i]) != true  )	continue;
		this.collideVs( this.activeActors[i] );
	}
	for(var i in this.activeActors)
	{
		var j = parseInt(i)+1;
		for(j; j<this.activeActors.length; j++)
		{
			this.activeActors[i].collide(this.activeActors[j]);
			this.activeActors[j].collide(this.activeActors[i]);
		}
	}
};
GameArea.prototype.collideType = function(act) {
	if(act instanceof CharActor)	return true;
	return false;
};


GameArea.prototype.collideVs = function( actor ) {
	var shiftpos = {x:0,y:0};
	if( actor.absBox.y < this.absBox.y && this.borderBlock.indexOf("N") !== -1)
	{
		shiftpos.y = this.absBox.y - actor.absBox.y;
	}
	if( this.borderBlock.indexOf("E") !== -1 )
	{
		var ptC = this.absBox.x + this.absBox.w;
		var ptactC = actor.absBox.x + actor.absBox.w;
		if(ptactC > ptC)				shiftpos.x = ptC - ptactC;
	}
	if( this.borderBlock.indexOf("S") !== -1 )
	{
		var ptD = this.absBox.y + this.absBox.h;
		var ptactD = actor.absBox.y + actor.absBox.h;
		if(ptactD > ptD)				shiftpos.y = ptD - ptactD;
	}
	if( actor.absBox.x < this.absBox.x && this.borderBlock.indexOf("W") !== -1 )
	{
		shiftpos.x = this.absBox.x - actor.absBox.x;
	}

	if(shiftpos.x != 0 || shiftpos.y != 0)
	{
		shiftpos.x = shiftpos.x + actor.position.x;
		shiftpos.y = shiftpos.y + actor.position.y;
	
		actor.updatePosition(shiftpos);
	}
};




GameArea.alloc = function() {
	var vc = new GameArea();
	vc.init();
	return vc;
};

