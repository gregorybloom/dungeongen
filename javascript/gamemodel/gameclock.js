
function GameClock() {
}
GameClock.prototype.identity = function() {
	return ('GameClock ()');
};
GameClock.prototype.init = function() {
	
	var d = new Date();
	this.isActive = false;
	
	this.startTime = d.getTime();
	this.stopTime = this.startTime;
};

GameClock.prototype.restart = function()
{	
	var d = new Date();
	this.startTime = d.getTime();
	this.stopTime = 0;
	this.isActive = true;
};
GameClock.prototype.clear = function()
{	
	var d = new Date();
	this.startTime = d.getTime();
	this.stopTime = this.startTime;
};
GameClock.prototype.start = function()
{	
	var d = new Date();
	this.startTime = d.getTime() - this.elapsedMS();
	this.stopTime = 0.0;
	this.isActive = true;
};
GameClock.prototype.stop = function()
{	
	var d = new Date();
	this.stopTime = d.getTime();
	this.isActive = false;
};
GameClock.prototype.elapsedMS = function()
{	
	var d = new Date();
	if( this.isActive==false )	return (this.stopTime - this.startTime);
	return (d.getTime() - this.startTime);
};


GameClock.alloc = function() {
	var vc = new GameClock();
	vc.init();
	return vc;
};


