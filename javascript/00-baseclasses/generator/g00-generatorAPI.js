
var BaseGen00 = BaseGen00 || {};

BaseGen00.GeneratorAPI = function() {}
BaseGen00.GeneratorAPI.prototype.identity = function() {
	return ('BaseGen00.GeneratorAPI ()');
};
BaseGen00.GeneratorAPI.prototype.init = function() {
	this.generator = null;
	
	this.genCamera = null;
};
BaseGen00.GeneratorAPI.prototype.close = function() {
	this.generator = null;

	this.genCamera = null;
};


BaseGen00.GeneratorAPI.prototype.update = function() {
	this.genCamera.updatePosition( GAMEMODEL.gamePlayers[0].absPosition );
	if(this.genCamera != null)		this.genCamera.update();
};
BaseGen00.GeneratorAPI.prototype.draw = function() {
	if(this.genCamera != null)		this.genCamera.draw();	
};


BaseGen00.GeneratorAPI.prototype.readInput = function(inputobj)
{
	var gameCamera = GAMEMODEL.fetchCamera();
	var keyused = false;
	if(GAMEMODEL.gameCamera != null)
	{
		var keyids = GAMECONTROL.keyIDs;	
		if(keyids['KEY_DASH'] == inputobj.keyID)
		{
			keyused = true;
			if(!inputobj.keypress)		gameCamera.zoomOut();
		}
		if(keyids['KEY_EQUALS'] == inputobj.keyID)
		{
			keyused = true;
			if(!inputobj.keypress)		gameCamera.zoomIn();			
		}
	}
	return keyused;
};


BaseGen00.GeneratorAPI.alloc = function() {
	var vc = new BaseGen00.GeneratorAPI();
	vc.init();
	return vc;
};


