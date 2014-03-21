
var BaseDung00 = BaseDung00 || {};

BaseDung00.DungeonAPI = function() {}
BaseDung00.DungeonAPI.prototype.identity = function() {
	return ('BaseDung00.DungeonAPI ()');
};
BaseDung00.DungeonAPI.prototype.init = function() {
	this.dunCamera = null;
};

BaseDung00.DungeonAPI.prototype.close = function() {
	this.dunCamera = null;	
};

BaseDung00.DungeonAPI.prototype.update = function() {
	this.dunCamera.updatePosition( GAMEMODEL.gamePlayers[0].absPosition );
	if(this.dunCamera != null)		this.dunCamera.update();
};
BaseDung00.DungeonAPI.prototype.draw = function() {
	if(this.dunCamera != null)		this.dunCamera.draw();	
};


BaseDung00.DungeonAPI.prototype.readInput = function(inputobj)
{
	var gameCamera = GAMEMODEL.fetchCamera();
	var keyused = false;
	if(gameCamera != null)
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


BaseDung00.DungeonAPI.alloc = function() {
	var vc = new BaseDung00.DungeonAPI();
	vc.init();
	return vc;
};


