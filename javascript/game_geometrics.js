
GAMEGEOM={
};

GAMEGEOM.init = function()
{
	return true;
};


GAMEGEOM.VectorMagnitude = function(v)
{
	return Math.sqrt( v.x*v.x + v.y*v.y );
};
GAMEGEOM.BoxContainsPt = function(B1, v)
{
	var ptA = {x:0,y:0};
	var ptD = {x:0,y:0};
	ptA.x = B1.x;
	ptA.y = B1.y;
	ptD.x = B1.x + B1.w;
	ptD.y = B1.y + B1.h;
	
	if(v.x < ptA.x || v.x > ptD.x)	return false;
	if(v.y < ptA.y || v.y > ptD.y)	return false;
	return true;
};
GAMEGEOM.BoxContains = function(B1, B2)
{
	var ptA = {x:0,y:0};
	var ptD = {x:0,y:0};
	ptA.x = B1.x;
	ptA.y = B1.y;
	ptD.x = B1.x + B1.w;
	ptD.y = B1.y + B1.h;
	var B2ptA = {x:0,y:0};
	var B2ptD = {x:0,y:0};
	B2ptA.x = B2.x;
	B2ptA.y = B2.y;
	B2ptD.x = B2.x + B2.w;
	B2ptD.y = B2.y + B2.h;
	
	if(B2ptA.x < ptA.x || B2ptD.x > ptD.x)	return false;
	if(B2ptA.y < ptA.y || B2ptD.y > ptD.y)	return false;
	return true;
};
GAMEGEOM.BoxIntersects = function(B1, B2)
{
	var ptA = {x:0,y:0};
	var ptD = {x:0,y:0};
	ptA.x = B1.x;
	ptA.y = B1.y;
	ptD.x = B1.x + B1.w;
	ptD.y = B1.y + B1.h;
	var B2ptA = {x:0,y:0};
	var B2ptD = {x:0,y:0};
	B2ptA.x = B2.x;
	B2ptA.y = B2.y;
	B2ptD.x = B2.x + B2.w;
	B2ptD.y = B2.y + B2.h;
	
	if(ptA.x >= B2ptD.x)	return false;
	if(ptD.x <= B2ptA.x)	return false;
	if(ptA.y >= B2ptD.y)	return false;
	if(ptD.y <= B2ptA.y)	return false;
	return true;
};
GAMEGEOM.BoxIntersection = function(B1, B2)
{
	x1 = B1.x;
	y1 = B1.y;
	x2 = B1.x + B1.w;
	y2 = B1.y + B1.h;
	var B2ptA = {x:0,y:0};
	var B2ptD = {x:0,y:0};
	B2ptA.x = B2.x;
	B2ptA.y = B2.y;
	B2ptD.x = B2.x + B2.w;
	B2ptD.y = B2.y + B2.h;

	if(x1 < B2ptA.x)	x1 = B2ptA.x;
	if(y1 < B2ptA.y)	y1 = B2ptA.y;
	if(x2 > B2ptD.x)	x2 = B2ptD.x;
	if(y2 > B2ptD.y)	y2 = B2ptD.y;
	
	if(x1 > x2 || y1 > y2)
	{
		x2 = x1;
		y2 = y1;
	}
	
	var Newbox = {x:x1,y:y1,w:(x2-x1),h:(y2-y1)};
	return Newbox;
};



GAMEGEOM.removeValue = function(array, object)
{
	var c = 0;
	for(var i in array)
	{
		if(  JSON.stringify(array[i]) === JSON.stringify(object)  )
		{
			array.splice(c,1);
			return;
		}
		c++;
	}	
	
};