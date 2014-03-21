




function Actor() {
}
/*	Actor.prototype = new Module;
/**/
Actor.prototype.identity = function() {
	return ('Actor (?)');
};



Actor.prototype.init = function() {
/*	Module.prototype.init.call(this);
/**/	
	this.size = {w:0,h:0};

	this.baseOffset = {x:0.5,y:0.5};
	this.anchorOffset = {x:0.5,y:0.5};

	this.position = {x:0,y:0};
	this.absPosition = {x:0,y:0};

	this.box = {x:0,y:0,w:0,h:0};
	this.absBox = {x:0,y:0,w:0,h:0};
	
	this.actionMode = null;

	this.lastUpdateTicks = GAMEMODEL.gameClock.elapsedMS();
	this.thisUpdateTicks = GAMEMODEL.gameClock.elapsedMS();
	this.ticksDiff = 0;
	
	this.animateModule = null;
};


Actor.prototype.update = function() {
	if(this.animateModule != null)	this.animateModule.update();
	
	this.lastUpdateTicks = this.thisUpdateTicks;
	this.thisUpdateTicks = GAMEMODEL.gameClock.elapsedMS();
	this.ticksDiff = this.thisUpdateTicks - this.lastUpdateTicks;
	
	this.updatePosition();
};
Actor.prototype.draw = function() {
//	GAMEVIEW.drawBox(this.absBox);

	if(this.animateModule != null)	this.animateModule.draw();
};
Actor.prototype.collide = function(act) {
	if(  this.collideType(act) != true  )							return;
	if(  GAMEGEOM.BoxIntersects(this.absBox, act.absBox)==true  )	
	{
		this.collideVs(act);
	}
};
Actor.prototype.collideType = function(act) {
	
};
Actor.prototype.collideVs = function(act) {
	
};





Actor.prototype.getAbsoluteShift = function() {
	return {x:0,y:0};
};
Actor.prototype.shiftPosition = function(shiftPos) {
	var P = {x:0,y:0};
	P.x = this.position.x+shiftPos.x;
	P.y = this.position.y+shiftPos.y;
	this.updatePosition(P);
};
Actor.prototype.updatePosition = function(newPos) {
	if(typeof newPos === "undefined")	newPos = this.position;
	var posShift = {};
	posShift.x = newPos.x + this.position.x;
	posShift.y = newPos.y + this.position.y;
	
	var offset = {};
	offset.x = this.baseOffset.x * this.size.w;
	offset.y = this.baseOffset.y * this.size.h;
	this.box.x = newPos.x - offset.x;
	this.box.y = newPos.y - offset.y;
	this.box.w = this.size.w;
	this.box.h = this.size.h;
	
	var absShift = this.getAbsoluteShift();
	this.absPosition.x = newPos.x + absShift.x;
	this.absPosition.y = newPos.y + absShift.y;
	this.absBox.x = this.absPosition.x - offset.x;
	this.absBox.y = this.absPosition.y - offset.y;
	this.absBox.w = this.size.w;
	this.absBox.h = this.size.h;
	
	this.position.x = newPos.x;
	this.position.y = newPos.y;
};

Actor.alloc = function() {
	var vc = new Actor();
	vc.init();
	return vc;
};


