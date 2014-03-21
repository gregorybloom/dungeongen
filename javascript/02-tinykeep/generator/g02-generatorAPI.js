var Gen02 = Gen02 || {};
Gen02.SeparateSteer = Gen02.SeparateSteer || {};

var GSepSteer = namespaceFn('Gen02.SeparateSteer');


GSepSteer.GeneratorAPI = function() {}
GSepSteer.GeneratorAPI.prototype = new BaseGen00.GeneratorAPI;
GSepSteer.GeneratorAPI.prototype.identity = function() {
	return ('Gen02.SeparateSteer.GeneratorAPI (' +this._dom.id+ ')');
};
GSepSteer.GeneratorAPI.prototype.init = function() {
	this.generator = null;
	
	this.genCamera = GameCamera.alloc();
	this.genCamera.displaySize = {w:GAMEVIEW.screen.w,h:GAMEVIEW.screen.h};
	this.genCamera.baseSize = {w:GAMEVIEW.screen.w,h:GAMEVIEW.screen.h};
	
	if(GAMEMODEL.gameCamera != null)	this.genCamera.updatePosition(  GAMEMODEL.gameCamera.absPosition  );
	
	this.genCamera.zoomOut();
	this.genCamera.zoomOut();
	this.genCamera.zoomOut();
};
GSepSteer.GeneratorAPI.prototype.update = function()
{
//	BaseGen00.GeneratorAPI.prototype.update.call(this);
	this.genCamera.updatePosition( GAMEMODEL.gamePlayers[0].absPosition );
	if(this.genCamera != null)		this.genCamera.update();

};


GSepSteer.GeneratorAPI.prototype.draw = function()
{
	BaseGen00.GeneratorAPI.prototype.draw.call(this);

		var ScreenPt = {x:10,y:(GAMEVIEW.screen.h-60)};
	var str = "floor: "+this.generator.viewHeight;
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
	var str = "Separate Steering Generator";
	if(this.generator.begin)		str = str+" ON";
	else							str = str+" OFF";
	GAMEVIEW.context.lineWidth = "3";
	GAMEVIEW.context.strokeStyle = "#FFFFFF";
	GAMEVIEW.context.strokeText(str,ScreenPt.x,ScreenPt.y);
	GAMEVIEW.context.font = "10pt Arial";
	GAMEVIEW.context.fillStyle = "#000000";
	GAMEVIEW.context.fillText(str,ScreenPt.x,ScreenPt.y);
};





GSepSteer.GeneratorAPI.prototype.tickSlower = function()
{
	this.generator.stepTime = this.generator.stepTime*1.5;
};
GSepSteer.GeneratorAPI.prototype.tickFaster = function()
{
	this.generator.stepTime = this.generator.stepTime/1.5;	
};


GSepSteer.GeneratorAPI.prototype.reframeCamera = function(cam, target, height)
{
	if(cam == null || typeof cam === "undefined")	cam = this.genCamera;
	
	var shift = {x:0,y:0};
	var centerBox = {x:0,y:0,w:0,h:0};

	centerBox.w = cam.absBox.w/2;
	centerBox.h = cam.absBox.h/2;
	centerBox.x = cam.absBox.x + centerBox.w/2;
	centerBox.y = cam.absBox.y + centerBox.h/2;

	while(GAMEGEOM.BoxContainsPt(centerBox,target) != true)
	{
		centerBox.w = cam.absBox.w/2;
		centerBox.h = cam.absBox.h/2;
		centerBox.x = cam.absBox.x + centerBox.w/2;
		centerBox.y = cam.absBox.y + centerBox.h/2;

		shift.x = (  target.x - (centerBox.x+centerBox.w/2)  )/2;
		shift.y = (  target.y - (centerBox.y+centerBox.h/2)  )/2;
		
		GAMEMODEL.gamePlayers[0].shiftPosition(shift);
		cam.updatePosition( GAMEMODEL.gamePlayers[0].absPosition );
	}
	
	this.generator.viewHeight = height;
};
GSepSteer.GeneratorAPI.prototype.reframeCameraToCoord = function(cam, target, height)
{
		var floor = this.generator.dungeonMap.floors[height];
		var cur = floor.tileGrid[target.x][target.y];
		var tileSize = floor.tileSize;
		
		var coord = {x:0,y:0};
		coord.x = tileSize.w*target.x + floor.absPosition.x - floor.size.w/2;
		coord.y = tileSize.h*target.y + floor.absPosition.y - floor.size.h/2;
		
		this.reframeCamera(cam, coord, height);		
};

GSepSteer.GeneratorAPI.prototype.readInput = function(inputobj)
{
	var gameCamera = GAMEMODEL.fetchCamera();
	
	var keyused = false;
	if(gameCamera != null)
	{
		var keyids = GAMECONTROL.keyIDs;	
		if(keyids['KEY_DASH'] == inputobj.keyID)
		{
			keyused = true;
			if( !GAMECONTROL.getKeyState(keyids['KEY_SHIFT']) )
			{
				if(!inputobj.keypress)		gameCamera.zoomOut();
			}
			else
			{
				if(!inputobj.keypress)		this.tickSlower();
			}
		}
		if(keyids['KEY_EQUALS'] == inputobj.keyID)
		{
			keyused = true;
			if( !GAMECONTROL.getKeyState(keyids['KEY_SHIFT']) )
			{
				if(!inputobj.keypress)		gameCamera.zoomIn();
			}
			else
			{
				if(!inputobj.keypress)		this.tickFaster();
			}
		}

		if(keyids['KEY_M'] == inputobj.keyID)
		{
			keyused = true;
//			if(!inputobj.keypress)		GAMEMUSIC.toggleMusic();			
		}
		if(keyids['KEY_G'] == inputobj.keyID)
		{
			keyused = true;
			if(!inputobj.keypress)		GAMEMODEL.buildMaze();
		}
		if(keyids['KEY_N'] == inputobj.keyID)
		{
			keyused = true;
			if(!inputobj.keypress)		GAMEMODEL.generator.buildNextSpot();			
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
				var viewHeight = Math.min(GAMEMODEL.generator.dungeonMap.totalHeight-1,GAMEMODEL.generator.viewHeight+1);
				GAMEMODEL.generator.viewHeight = viewHeight;
			}
		}
		if(keyids['KEY_SQUAREBR_RIGHT'] == inputobj.keyID)
		{
			keyused = true;
			if(!inputobj.keypress)
			{	
				var viewHeight = Math.max(0,GAMEMODEL.generator.viewHeight-1);
				GAMEMODEL.generator.viewHeight = viewHeight;
			}
		}
		if(keyids['KEY_BACKSLASH'] == inputobj.keyID)
		{
			keyused = true;			
			if(!inputobj.keypress)
			{
				if(this.generator.autostep)		this.generator.autostep = false;
				else							this.generator.autostep = true;
			}
		}
	}
	return keyused;
};


GSepSteer.GeneratorAPI.alloc = function() {
	var vc = new GSepSteer.GeneratorAPI();
	vc.init();
	return vc;
};


