



function CharActor() {
}
CharActor.prototype = new Actor;
CharActor.prototype.identity = function() {
	return ('CharActor (' +this._dom.id+ ')');
};
CharActor.prototype.init = function() {
	Actor.prototype.init.call(this);

	this.size = {w:22,h:22};

	this.position = {x:0,y:0};


	this.baseOffset = {x:0.5,y:0.35};
	this.actionMode = "MODE_STILL";
	
	this.heading = {x:0,y:0};
	
	this.accel = 0.0005;
	this.accelHeading = {x:0,y:0};
	
	this.flatFacing = 0;
	this.facing = {x:0,y:-1};
	this.unitSpeed = 0.18;
	this.ticksDiff = 0;
	this.dirTimeOut = 40;

	this.keyTimeList = [];
	for(var i=0; i<4; i++)	this.keyTimeList[i] = GAMEMODEL.gameClock.elapsedMS();

	this.updatePosition();
};
CharActor.prototype.update = function() {
	Actor.prototype.update.call(this);
	
	this.updateCurrentMode();
	
	if(this.actionMode === "MODE_MOVING")
	{
		var newPos = {x:0,y:0};
//				console.log(  JSON.stringify(this.heading)  );
		
		this.heading.x += this.accelHeading.x*this.ticksDiff;
		this.heading.y += this.accelHeading.y*this.ticksDiff;
		newPos.x = this.position.x + this.heading.x*this.ticksDiff;
		newPos.y = this.position.y + this.heading.y*this.ticksDiff;

		this.updatePosition(newPos);
	}
		var curtime = GAMEMODEL.gameClock.elapsedMS();
		
};
CharActor.prototype.updateCurrentMode = function() {
	
	if(this.actionMode == "MODE_STILL" || this.actionMode == "MODE_MOVING")
	{
		if(this.heading.x == 0 && this.heading.y == 0)	this.actionMode = "MODE_STILL";
		if(this.heading.x != 0 || this.heading.y != 0)	this.actionMode = "MODE_MOVING";
	}
};


CharActor.prototype.readInput = function(inputobj)
{
	var keyused = false;
	var keyids = GAMECONTROL.keyIDs;

	if(keyids['KEY_ARROW_UP'] == inputobj.keyID || keyids['KEY_W'] == inputobj.keyID)
	{
		keyused = true;
		if(inputobj.keypress == false)
		{
			this.heading.y = 0;
			this.accelHeading.y = 0;
			this.keyTimeList[0] = GAMEMODEL.gameClock.elapsedMS();
		}
		if(inputobj.keypress == true)
		{
//			this.heading.y = -1;
			this.accelHeading.y = -1*this.accel;
			if(this.heading.y == 0)		this.heading.y = this.accelHeading.y;
		}
	}
	if(keyids['KEY_ARROW_DOWN'] == inputobj.keyID || keyids['KEY_S'] == inputobj.keyID)
	{
		keyused = true;
		if(inputobj.keypress == false)
		{
			this.heading.y = 0;
			this.accelHeading.y = 0;
			this.keyTimeList[2] = GAMEMODEL.gameClock.elapsedMS();
		}
		if(inputobj.keypress == true)
		{
			this.accelHeading.y = 1*this.accel;
			if(this.heading.y == 0)		this.heading.y = this.accelHeading.y;
		}
	}
	if(keyids['KEY_ARROW_RIGHT'] == inputobj.keyID || keyids['KEY_D'] == inputobj.keyID)
	{
		keyused = true;
		if(inputobj.keypress == false)
		{
			this.heading.x = 0;
			this.accelHeading.x = 0;
			this.keyTimeList[1] = GAMEMODEL.gameClock.elapsedMS();
		}
		if(inputobj.keypress == true)
		{
//			this.heading.x = 1;
			this.accelHeading.x = 1*this.accel;
			if(this.heading.x == 0)		this.heading.x = this.accelHeading.x;
		}
	}
	if(keyids['KEY_ARROW_LEFT'] == inputobj.keyID || keyids['KEY_A'] == inputobj.keyID)
	{
		keyused = true;
		if(inputobj.keypress == false)
		{
			this.heading.x = 0;
			this.accelHeading.x = 0;
			this.keyTimeList[3] = GAMEMODEL.gameClock.elapsedMS();
		}
		if(inputobj.keypress == true)
		{
//			this.heading.x = -1;
			this.accelHeading.x = -1*this.accel;
			if(this.heading.x == 0)		this.heading.x = this.accelHeading.x;
		}
	}
	return keyused;
};
Actor.prototype.draw = function() {
	GAMEVIEW.drawBox(null, this.absBox, "red");
};

CharActor.alloc = function() {
	var vc = new CharActor();
	vc.init();
	return vc;
};

