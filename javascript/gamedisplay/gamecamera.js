
function GameCamera() {
}
GameCamera.prototype = new Actor;
GameCamera.prototype.identity = function() {
	return ('GameCamera (' +this._dom.id+ ')');
};
GameCamera.prototype.init = function() {
	Actor.prototype.init.call(this);
		
	
	this.baseSize = {w:0,h:0};
	this.displaySize = {w:0,h:0};
	
	this.zoom = 3.0;
	
	
	this.containArea = null;
};


GameCamera.prototype.moveCameraTo = function(pos)
{	
	this.updatePosition(pos);
/*	if(this.containArea != null && this.containArea instanceof Actor)
	{
		var vect = {x:0,y:0};
		vect.x = this.containArea.position.x - this.position.x;
		vect.y = this.containArea.position.y - this.position.y;
		var m = GAMEGEOM.VectorMagnitude(vect);
		vect.x = vect.x/m;
		vect.y = vect.y/m;
		
		while(  !GAMEGEOM.BoxIntersects(this.absBox, this.containArea.absBox)  )
		{
			var newvect = {x:0,y:0};
			newvect.x = this.position.x + vect.x;
			newvect.y = this.position.y + vect.y;
			this.updatePosition(newvect);
		}
	}		/**/
};
GameCamera.prototype.shiftCameraTo = function(shift)
{
	var newpos = {};
	newpos.x = this.position.x + shift.x;
	newpos.y = this.position.y + shift.y;
	
	this.moveCameraTo(newpos);
};

GameCamera.prototype.getCameraShift = function()
{
	var vect = {x:0,y:0};
	vect.x = this.position.x - this.size.w / 2;
	vect.y = this.position.y - this.size.h / 2;
	return vect;
};

GameCamera.prototype.update = function()
{
	this.size.w = this.baseSize.w * this.zoom;
	this.size.h = this.baseSize.h * this.zoom;
	this.updatePosition();
};
GameCamera.prototype.zoomIn = function()
{
	this.zoom = this.zoom * 0.75;
	if(this.zoom < 0.75)	this.zoomOut();
};
GameCamera.prototype.zoomOut = function()
{
	this.zoom = this.zoom / 0.75;
	if(this.zoom > 8)	this.zoomIn();
};


GameCamera.alloc = function() {
	var vc = new GameCamera();
	vc.init();
	return vc;
};


