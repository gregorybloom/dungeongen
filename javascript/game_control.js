
GAMECONTROL={
	keyState: {},
	keyTime: {},
	keyIDs: {}
};

GAMECONTROL.init = function()
{
	this.keyIDs['KEY_DELETE'] = 8;

	this.keyIDs['KEY_RETURN'] = 13;

	this.keyIDs['KEY_SHIFT'] = 16;
	this.keyIDs['KEY_CONTROL'] = 17;
	this.keyIDs['KEY_OPTION'] = 18;

	this.keyIDs['KEY_ESCAPE'] = 27;

	this.keyIDs['KEY_SPACEBAR'] = 32;

	this.keyIDs['KEY_ARROW_LEFT'] = 37;
	this.keyIDs['KEY_ARROW_UP'] = 38;
	this.keyIDs['KEY_ARROW_RIGHT'] = 39;
	this.keyIDs['KEY_ARROW_DOWN'] = 40;

	this.keyIDs['KEY_1'] = 49;
	this.keyIDs['KEY_2'] = 50;
	this.keyIDs['KEY_3'] = 51;
	this.keyIDs['KEY_4'] = 52;
	this.keyIDs['KEY_5'] = 53;
	this.keyIDs['KEY_6'] = 53;
	this.keyIDs['KEY_7'] = 53;
	this.keyIDs['KEY_8'] = 53;
	this.keyIDs['KEY_9'] = 53;

	this.keyIDs['KEY_W'] = 87;
	this.keyIDs['KEY_A'] = 65;
	this.keyIDs['KEY_S'] = 83;
	this.keyIDs['KEY_D'] = 68;

	this.keyIDs['KEY_G'] = 71;

	this.keyIDs['KEY_M'] = 77;
	this.keyIDs['KEY_N'] = 78;
	
	this.keyIDs['KEY_P'] = 80;

	this.keyIDs['KEY_DASH'] = 189;
	this.keyIDs['KEY_EQUALS'] = 187;

	this.keyIDs['KEY_SQUAREBR_LEFT'] = 219;
	this.keyIDs['KEY_SQUAREBR_RIGHT'] = 221;

	this.keyIDs['KEY_SEMICOLON'] = 186;
	this.keyIDs['KEY_APOSTROPHE'] = 222;

	this.keyIDs['KEY_COMMA'] = 188;
	this.keyIDs['KEY_PERIOD'] = 290;

	this.keyIDs['KEY_TILDE'] = 192;

	this.keyIDs['KEY_BACKSLASH'] = 220;

	return true;
};

GAMECONTROL.onMouseMove = function()
{

};
GAMECONTROL.onMouseDown = function()
{

};
GAMECONTROL.onMouseClick = function()
{

};
GAMECONTROL.onMouseDoubleClick = function()
{

};


GAMECONTROL.onKeyUp = function(e)
{
	var KeyID = (window.event) ? event.keyCode : e.keyCode;
	GAMECONTROL.setKeyState(KeyID, false);

	var inobj = {};
	inobj.keyID = KeyID;
	inobj.keypress = false;
	
	var used = GAMEMODEL.distributeInput(inobj);

	if(used)	e.preventDefault();
	else					console.log(KeyID);
};
GAMECONTROL.onKeyDown = function(e)
{
	var KeyID = (window.event) ? event.keyCode : e.keyCode;
	GAMECONTROL.setKeyState(KeyID, true);

	var inobj = {};
	inobj.keyID = KeyID;
	inobj.keypress = true;
	
	var used = GAMEMODEL.distributeInput(inobj);


	if(used)	e.preventDefault();
};


GAMECONTROL.setKeyState = function(id, press)
{
	if(press)		this.keyState[id] = true;
	else
	{
		delete this.keyState[id];
	}
	
};
GAMECONTROL.getKeyState = function(id)
{
	if(typeof this.keyState[id] === "undefined")	return false;
	else if(this.keyState[id] == null)				return false;
	else
	{
		return this.keyState[id];
	}
};