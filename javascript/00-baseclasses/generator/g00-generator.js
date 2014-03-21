
var BaseGen00 = BaseGen00 || {};

BaseGen00.Generator = function() {}
BaseGen00.Generator.prototype.identity = function() {
	return ('BaseGen00.Generator ()');
};

BaseGen00.Generator.prototype.init = function() {

	this.dungeonMap = null;
	this.generatorAPI = null;

	this.autostep = false;
	this.stepTime = 500;
	this.curTimeStep = 0;
	
	this.begin = false;
	this.finished = false;

	if(GAMEMODEL.gameClock != null)		this.curTimeStep = GAMEMODEL.gameClock.elapsedMS();
};

BaseGen00.Generator.prototype.close = function()
{
	this.generatorAPI.close();
	this.generatorAPI = null;
	
	this.dungeonMap = null;
//	GAMEMODEL.generator = null;

	this.autostep = false;
};

BaseGen00.Generator.prototype.readInput = function(inputobj)
{
	var keyused = false;
	if(this.generatorAPI != null)	keyused = keyused || this.generatorAPI.readInput(inputobj);
	return keyused;
};
BaseGen00.Generator.prototype.draw = function() {
};


BaseGen00.Generator.prototype.beginMaze = function() {
	
	GAMEMODEL.gameAreas[0].size = {w:this.dungeonMap.size.w,h:this.dungeonMap.size.h};
	GAMEMODEL.gameAreas[0].updatePosition({x:0,y:0});
};


BaseGen00.Generator.prototype.update = function()
{
	if(this.generatorAPI != null)	this.generatorAPI.update();
	
	if(GAMEMODEL.gameClock != null)
	{
		if(this.autostep == true && this.begin == true)
		{
			var diff = GAMEMODEL.gameClock.elapsedMS()-this.curTimeStep;
//				var str = this.autostep+" - "+this.stepTime+" <= "+diff;
//				str += "  <= "+diff+" = "+GAMEMODEL.gameClock.elapsedMS()+" - "+this.curTimeStep;
//				console.log( str );
			if(this.stepTime <= diff)
			{
				this.curTimeStep += this.stepTime;
				this.buildNextSpot();
			}
		}
		else
		{
			this.curTimeStep = GAMEMODEL.gameClock.elapsedMS();
		}
	}	/**/
};
BaseGen00.Generator.prototype.draw = function()
{
	if(this.dungeonMap != null)		this.dungeonMap.draw();
	if(this.generatorAPI != null)	this.generatorAPI.draw();
};


BaseGen00.Generator.prototype.buildNextSpot = function() {
	
};


BaseGen00.Generator.alloc = function() {
	var vc = new BaseGen00.Generator();
	vc.init();
	return vc;
};


