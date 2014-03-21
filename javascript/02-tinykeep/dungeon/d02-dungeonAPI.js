//			http://elegantcode.com/2011/01/26/basic-javascript-part-8-namespaces/
/*
var AppSpace = AppSpace || {};
AppSpace.Podcast = function {
    this.title = 'Astronomy Cast';
    this.description = 'A fact-based journey through the galaxy.';
    this.link = 'http://www.astronomycast.com';
};
AppSpace.Podcast.prototype.toString = function() {
    return 'Title: ' + this.title;
}	/**/

var Dung02 = Dung02 || {};
Dung02.SeparateSteer = Dung02.SeparateSteer || {};

var DSepSteer = namespaceFn('Dung02.SeparateSteer');


DSepSteer.DungeonAPI = function() {}
DSepSteer.DungeonAPI.prototype = new BaseDung00.DungeonAPI;

DSepSteer.DungeonAPI.prototype.identity = function() {
	return ('Dung02.SeparateSteer.DungeonAPI (' +this._dom.id+ ')');
};
DSepSteer.DungeonAPI.prototype.init = function() {
	BaseDung00.DungeonAPI.prototype.init.call(this);
	
	this.dunCamera = GameCamera.alloc();
	this.dunCamera.displaySize = {w:GAMEVIEW.screen.w,h:GAMEVIEW.screen.h};
	this.dunCamera.baseSize = {w:GAMEVIEW.screen.w,h:GAMEVIEW.screen.h};
	
	if(GAMEMODEL.gameCamera != null)	this.dunCamera.updatePosition(  GAMEMODEL.gameCamera.absPosition  );
};


DSepSteer.DungeonAPI.prototype.draw = function()
{
	BaseDung00.DungeonAPI.prototype.draw.call(this);

		var ScreenPt = {x:10,y:(GAMEVIEW.screen.h-60)};
	var str = "floor: "+GAMEMODEL.dungeon.viewHeight;
	GAMEVIEW.context.lineWidth = "3";
	GAMEVIEW.context.strokeStyle = "#FFFFFF";
	GAMEVIEW.context.strokeText(str,ScreenPt.x,ScreenPt.y);
	GAMEVIEW.context.font = "10pt Arial";
	GAMEVIEW.context.fillStyle = "#000000";
	GAMEVIEW.context.fillText(str,ScreenPt.x,ScreenPt.y);

	if(GAMEMODEL.gameMode === "GAME_MUSICPAUSE" || GAMEMODEL.gameMode === "GAME_INIT")
	{
			ctxt.fillStyle = "rgba(155,155,255,0.35)";
			ctxt.fillRect( 0, 0, GAMEVIEW.screen.w, GAMEVIEW.screen.h );

		var ScreenPt = {x:10,y:(GAMEVIEW.screen.h-45)};
		var str = "MUSIC LOADING...";
		GAMEVIEW.context.lineWidth = "3";
		GAMEVIEW.context.strokeStyle = "#FFFFFF";
		GAMEVIEW.context.strokeText(str,ScreenPt.x,ScreenPt.y);
		GAMEVIEW.context.font = "10pt Arial";
		GAMEVIEW.context.fillStyle = "#000000";
		GAMEVIEW.context.fillText(str,ScreenPt.x,ScreenPt.y);
	}
	else if(GAMEMODEL.gameMode === "GAME_PAUSE")
	{
			ctxt.fillStyle = "rgba(255,255,255,0.35)";
			ctxt.fillRect( 0, 0, GAMEVIEW.screen.w, GAMEVIEW.screen.h );

		var ScreenPt = {x:10,y:(GAMEVIEW.screen.h-45)};
		var str = "GAME PAUSED";
		GAMEVIEW.context.lineWidth = "3";
		GAMEVIEW.context.strokeStyle = "#FFFFFF";
		GAMEVIEW.context.strokeText(str,ScreenPt.x,ScreenPt.y);
		GAMEVIEW.context.font = "10pt Arial";
		GAMEVIEW.context.fillStyle = "#000000";
		GAMEVIEW.context.fillText(str,ScreenPt.x,ScreenPt.y);
	}
	
		var ScreenPt = {x:10,y:(GAMEVIEW.screen.h-30)};
	GAMEVIEW.context.lineWidth = "3";
	GAMEVIEW.context.strokeStyle = "#FFFFFF";
	GAMEVIEW.context.strokeText(GAMEVIEW.fps+" fps",ScreenPt.x,ScreenPt.y);
	GAMEVIEW.context.font = "10pt Arial";
	GAMEVIEW.context.fillStyle = "#000000";
	GAMEVIEW.context.fillText(GAMEVIEW.fps+" fps",ScreenPt.x,ScreenPt.y);

		var ScreenPt = {x:10,y:(GAMEVIEW.screen.h-15)};
	var str = GAMEMODEL.activeObjs+" active objs";
	GAMEVIEW.context.lineWidth = "3";
	GAMEVIEW.context.strokeStyle = "#FFFFFF";
	GAMEVIEW.context.strokeText(str,ScreenPt.x,ScreenPt.y);
	GAMEVIEW.context.font = "10pt Arial";
	GAMEVIEW.context.fillStyle = "#000000";
	GAMEVIEW.context.fillText(str,ScreenPt.x,ScreenPt.y);




		var ScreenPt = {x:10,y:15};
	var str = "Separate Steering Dungeon";
	GAMEVIEW.context.lineWidth = "3";
	GAMEVIEW.context.strokeStyle = "#FFFFFF";
	GAMEVIEW.context.strokeText(str,ScreenPt.x,ScreenPt.y);
	GAMEVIEW.context.font = "10pt Arial";
	GAMEVIEW.context.fillStyle = "#000000";
	GAMEVIEW.context.fillText(str,ScreenPt.x,ScreenPt.y);
};






DSepSteer.DungeonAPI.prototype.readInput = function(inputobj)
{
	var keyused = false;
	var gameCamera = GAMEMODEL.fetchCamera();
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

		if(keyids['KEY_M'] == inputobj.keyID)
		{
			keyused = true;
			if(!inputobj.keypress)		GAMEMUSIC.toggleMusic();			
		}
		if(keyids['KEY_G'] == inputobj.keyID)
		{
			keyused = true;
			if(!inputobj.keypress)		GAMEMODEL.buildMaze();
		}
		if(keyids['KEY_P'] == inputobj.keyID)
		{
			keyused = true;
			if(!inputobj.keypress)		GAMEMODEL.togglePause();			
		}
		if(keyids['KEY_SQUAREBR_LEFT'] == inputobj.keyID)
		{
			keyused = true;
			if(!inputobj.keypress)
			{	
				var viewHeight = Math.min(GAMEMODEL.dungeon.dungeonMap.totalHeight-1,GAMEMODEL.dungeon.viewHeight+1);
				GAMEMODEL.dungeon.viewHeight = viewHeight;
			}
		}
		if(keyids['KEY_SQUAREBR_RIGHT'] == inputobj.keyID)
		{
			keyused = true;
			if(!inputobj.keypress)
			{	
				var viewHeight = Math.max(0,GAMEMODEL.dungeon.viewHeight-1);
				GAMEMODEL.dungeon.viewHeight = viewHeight;
			}
		}
	}
	return keyused;
};


DSepSteer.DungeonAPI.alloc = function() {
	var vc = new DSepSteer.DungeonAPI();
	vc.init();
	return vc;
};


