GAMEVIEW={
	screen: {w:0,h:0},
	context: null,
	canvas: null,
	loadedImgs: {},
	
	avgTick: 0,
	lastTick: 0,
	
	MAXSAMPLES: 100,
	tickindex: 0,
	ticksum: 0,
	ticklist: {},
	
	boundTexture: -1,
	drawcount: 0	
};

GAMEVIEW.init = function()
{
	if( !this.loadTextures() )		return false;

//		this.lastTick = GAMEMODEL.gameClock.elapsedMS();
	
	return true;
};
GAMEVIEW.loadTextures = function()
{

	return true;
};
GAMEVIEW.set = function(screendim, cont)
{
	this.fps = 0;
	
	this.screen.w = screendim.w/3;
	this.screen.h = screendim.h/3;
	this.context = cont;
	
	var canvas = document.getElementsByTagName('canvas')[0];
	this.canvas = canvas;
	canvas.width  = screendim.w/3;
	canvas.height = screendim.h/3;
//	Note that this clears the canvas, though you should follow with ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height); 	to handle those browsers that don't fully clear the canvas. You'll need to redraw of any content you wanted displayed after the size change.
	this.context.clearRect( 0, 0, this.context.canvas.width, this.context.canvas.height);

};

GAMEVIEW.updateAll = function()
{
	if(GAMEMODEL.gameMode === "GAME_RUN")
	{
		var newTick = GAMEMODEL.gameClock.elapsedMS();
//		console.log("newTick: "+newTick);

		var TickDiff = newTick - this.lastTick;
		this.avgTick = GAMEVIEW.calcAverageTick( TickDiff );
				
		this.lastTick = newTick;
	}
};
GAMEVIEW.drawAll = function()
{
	ctxt.fillStyle = "#FFFFFF";
	ctxt.fillRect( 0, 0, this.screen.w, this.screen.h );
	
	if(GAMEMODEL.gameMode !== "GAME_INIT")		GAMEMODEL.drawAll();
	
	var fps = 1000 / this.avgTick;
	fps = Math.floor( fps );	
};


GAMEVIEW.calcAverageTick = function(newtick)
{
	if(typeof this.ticklist[ this.tickindex ] === "undefined")
	{
		this.ticklist[ this.tickindex ] = 0;
	}
	
	this.ticksum -= this.ticklist[ this.tickindex ];
	this.ticksum += newtick;
	
	this.ticklist[ this.tickindex ] = newtick;
	this.tickindex = this.tickindex+1;
	
	if( this.tickindex == this.MAXSAMPLES )
	{
		this.tickindex = 0;
		this.fps = Math.floor(1000/(this.ticksum/this.MAXSAMPLES));
				console.log( "fps: "+this.fps );
	}

	return (this.ticksum/this.MAXSAMPLES);
};

GAMEVIEW.BoxIsInCamera = function(box, shift, cam)
{
	var camera = cam;
	if(typeof camera === "undefined" || camera == null)		camera = GAMEMODEL.fetchCamera();

	if(typeof shift === "undefined" || shift == null)		shift = {x:0, y:0};
	if(typeof shift.x === "undefined")	shift.x = 0;
	if(typeof shift.y === "undefined")	shift.y = 0;
	
	if(camera != null && camera instanceof GameCamera)
	{
		var absBox = camera.absBox;
		var shiftBox = {x:box.x, y:box.y, w:box.w, h:box.h};
		shiftBox.x = shiftBox.x+shift.x;
		shiftBox.y = shiftBox.y+shift.y;

		return GAMEGEOM.BoxIntersects(absBox, shiftBox);
	}
	return false;
};
GAMEVIEW.DrawCoordsToPt = function(drawPt, vShift, cam)
{
	var camera = cam;
	if(typeof camera === "undefined" || camera == null)		camera = GAMEMODEL.fetchCamera();

	if(typeof vShift === "undefined")	vShift = null;
	
	var zoom = camera.zoom;

	var camShift = camera.getCameraShift();
	camShift.x = Math.floor(camShift.x);
	camShift.y = Math.floor(camShift.y);

	var convPt = {};
	convPt.x = drawPt.x*zoom;
	convPt.y = drawPt.y*zoom;

	if(vShift != null)			convPt.x += vShift.x;
	if(vShift != null)			convPt.y += vShift.y;
	
	if(camShift.x != null)		convPt.x += camShift.x;
	if(camShift.y != null)		convPt.y += camShift.y;
	return convPt;
};

GAMEVIEW.PtToDrawCoords = function(absPt, vShift, cam)
{
	var camera = cam;
	if(typeof camera === "undefined" || camera == null)		camera = GAMEMODEL.fetchCamera();

	if(typeof vShift === "undefined")	vShift = null;
	
	var zoom = camera.zoom;

	var camShift = camera.getCameraShift();
	camShift.x = Math.floor(camShift.x);
	camShift.y = Math.floor(camShift.y);

	var drawPt = {x:0,y:0};
	if(absPt != null)			drawPt.x += absPt.x;
	if(absPt != null)			drawPt.y += absPt.y;
	if(camShift.x != null)		drawPt.x -= camShift.x;
	if(camShift.y != null)		drawPt.y -= camShift.y;
	if(vShift != null)			drawPt.x += vShift.x;
	if(vShift != null)			drawPt.y += vShift.y;

	drawPt.x = drawPt.x/zoom;
	drawPt.y = drawPt.y/zoom;

	return drawPt;
};
GAMEVIEW.BoxToDrawCoords = function(absBox, vShift, cam)
{
	var camera = cam;
	if(typeof camera === "undefined" || camera == null)		camera = GAMEMODEL.fetchCamera();

	if(typeof vShift === "undefined")	vShift = null;

	var zoom = camera.zoom;

	var drawBox = {x:0,y:0,w:0,h:0};
	var drawPt = GAMEVIEW.PtToDrawCoords(absBox, vShift, camera);
	
	drawBox.x = drawPt.x;
	drawBox.y = drawPt.y;
	drawBox.w = absBox.w/zoom;
	drawBox.h = absBox.h/zoom;

	return drawBox;
};



/*		GAMEVIEW.drawFromAnimationFrame( frame, this.target.absPosition, {x:0,y:0}, this.target.absBox.ptC, this.target.drawLayer, null );
/**/
GAMEVIEW.drawFromAnimationFrame = function(cam, frame, absPosition, vShift, drawPt, dLayer, filter)
{
	var camera = cam;
	if(typeof camera === "undefined" || camera == null)		camera = GAMEMODEL.fetchCamera();

	if(frame == null)	return;
	
	var imgFrame = GAMEANIMATIONS.getImageFrame(frame.imgNum, frame.imgFrameNum);
	if(imgFrame == null)	return;
			
	var drawSize = {w:0,h:0};
	drawSize.w = frame.scale.w*imgFrame.dim.w;
	drawSize.h = frame.scale.h*imgFrame.dim.h;
	drawSize.w = Math.abs(drawSize.w);
	drawSize.h = Math.abs(drawSize.h);
	
	var drawBox = {w:drawSize.w,h:drawSize.h};
	drawBox.x = absPosition.x - imgFrame.baseKeypt.x;
	drawBox.y = absPosition.y - imgFrame.baseKeypt.y;
	
	if( !GAMEVIEW.BoxIsInCamera(drawBox, vShift, camera) )		return;
	
		
	// convert to screen values
	var zoom = camera.zoom;
	drawSize.w = drawSize.w / zoom;
	drawSize.h = drawSize.h / zoom;
	
	if(typeof vShift === "undefined")	vShift = null;
	if(vShift == null)			vShift = {x:0,y:0};
	vShift.x -= imgFrame.baseKeypt.x;
	vShift.y -= imgFrame.baseKeypt.y;
	
	var drawPos = GAMEVIEW.PtToDrawCoords(absPosition, vShift, camera);
	
	if(typeof this.loadedImgs[frame.imgNum] === "undefined")	return;
	var img = this.loadedImgs[frame.imgNum].img;
	if(typeof img === "undefined" || img == null)	return;
		
		//draw frame
		this.context.save();
		this.context.scale(1,1);

		this.context.drawImage(img, 

			imgFrame.pos.x,imgFrame.pos.y,   //sprite sheet top left 
			imgFrame.dim.w, imgFrame.dim.h,    	//sprite sheet width/height
			drawPos.x, drawPos.y, //destination x/y
			drawSize.w, drawSize.h     
			   //destination width/height  (this can be used to scale)
		);
		this.context.restore();

};

GAMEVIEW.fillBox = function(cam, absBox, color)
{
	if(typeof color === "undefined")		color = "#FF0000";
	if(typeof color === "object" && typeof color.a === "undefined")	color="rgb("+color.r+","+color.g+","+color.b+")";
	if(typeof color === "object" && typeof color.a !== "undefined")	
	{
		color="rgba("+color.r+","+color.g+","+color.b+","+color.a+")";
	}

	if( !GAMEVIEW.BoxIsInCamera(absBox, null, cam) )		return;
	
	var drawBox = GAMEVIEW.BoxToDrawCoords(absBox, null, cam);

	this.context.fillStyle=color;
	this.context.fillRect(drawBox.x, drawBox.y, drawBox.w, drawBox.h);
};
GAMEVIEW.drawBox = function(cam, absBox, color, width)
{
	if(typeof color === "undefined")		color = "#FF0000";
	if(typeof color === "object" && typeof color.a === "undefined")	color="rgb("+color.r+","+color.g+","+color.b+")";
	if(typeof color === "object" && typeof color.a !== "undefined")	
	{
		color="rgba("+color.r+","+color.g+","+color.b+","+color.a+")";
	}
	if(typeof width === "undefined")		width = 1;

	if( !GAMEVIEW.BoxIsInCamera(absBox, null, cam) )		return;
	
	var drawBox = GAMEVIEW.BoxToDrawCoords(absBox, null, cam);

	this.context.beginPath();
	this.context.rect(  drawBox.x, drawBox.y, drawBox.w, drawBox.h);
	this.context.lineWidth = width;
	this.context.strokeStyle = color;
	this.context.stroke();	
};
GAMEVIEW.drawCircle = function(cam, centerPt, radius, color, width)
{
	var camera = cam;
	if(typeof camera === "undefined" || camera == null)		camera = GAMEMODEL.fetchCamera();

	if(typeof color === "undefined")		color = "#FF0000";
	if(typeof width === "undefined")		width = 1;

	var absBox = {x:centerPt.x,y:centerPt.y,w:radius*2,h:radius*2};
	absBox.x = absBox.x - radius;
	absBox.y = absBox.y - radius;

	if( !GAMEVIEW.BoxIsInCamera(absBox, null, camera) )		return;
	
	var zoom = camera.zoom;

	var drawCenter = GAMEVIEW.PtToDrawCoords(centerPt, null, camera);

	radius = radius/zoom;

	this.context.beginPath();
	this.context.arc(drawCenter.x, drawCenter.y, radius, 0,2*Math.PI);
	this.context.lineWidth = width;
	this.context.strokeStyle = color;
	this.context.stroke();	
};
GAMEVIEW.fillCircle = function(cam, centerPt, radius, color)
{
	var camera = cam;
	if(typeof camera === "undefined" || camera == null)		camera = GAMEMODEL.fetchCamera();

	if(typeof color === "undefined")		color = "#FF0000";

	var absBox = {x:centerPt.x,y:centerPt.y,w:radius*2,h:radius*2};
	absBox.x = absBox.x - radius;
	absBox.y = absBox.y - radius;

	if( !GAMEVIEW.BoxIsInCamera(absBox, null, camera) )		return;
	
	var zoom = camera.zoom;

	var drawCenter = GAMEVIEW.PtToDrawCoords(centerPt, null, camera);

	radius = radius/zoom;

	this.context.beginPath();
	this.context.arc(drawCenter.x, drawCenter.y, radius, 0,2*Math.PI);
	this.context.fillStyle = color;
	this.context.fill();	
};

GAMEVIEW.drawLine = function(cam, absPt1, absPt2, color, width)
{
	if(typeof color === "undefined")		color = "#FF0000";
	if(typeof width === "undefined")		width = 1;

//	if( !GAMEVIEW.BoxIsInCamera(absPt1) )		return;		// LINE vs BOX
	
	var drawPt1 = GAMEVIEW.PtToDrawCoords(absPt1, null, cam);
	var drawPt2 = GAMEVIEW.PtToDrawCoords(absPt2, null, cam);

	this.context.moveTo(drawPt1.x, drawPt1.y);
	this.context.lineWidth = width;
	this.context.strokeStyle = color;
	this.context.lineTo(drawPt2.x, drawPt2.y);
	this.context.stroke();	
};
GAMEVIEW.fillText = function(cam, absPt, text, font, color)
{
	if(typeof color === "undefined")		color = "#FF0000";

//	if( !GAMEVIEW.BoxIsInCamera(absPt1) )		return;		// LINE vs BOX
	
	var drawPt = GAMEVIEW.PtToDrawCoords(absPt, null, cam);

	this.context.font = font;
	this.context.fillStyle = color;
	this.context.fillText(text,drawPt.x,drawPt.y);
};
GAMEVIEW.drawText = function(cam, absPt, text, font, color, width)
{
	if(typeof color === "undefined")		color = "#FF0000";
	if(typeof width === "undefined")		width = 1;

//	if( !GAMEVIEW.BoxIsInCamera(absPt1) )		return;		// LINE vs BOX
	
	var drawPt = GAMEVIEW.PtToDrawCoords(absPt, null, cam);

	this.context.font = font;
	this.context.lineWidth = width;
	this.context.strokeStyle = color;
	this.context.strokeText(text,drawPt.x,drawPt.y);
};

