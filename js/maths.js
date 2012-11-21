function getDistance(x1, y1, x2, y2) {
	return Math.floor((Math.abs(Math.sqrt(((x1 - x2) * (x1 - x2) ) + ( (y1 - y2) * (y1 - y2) ) ))));
}

function getTilePos(xIn, yIn) {
return { 'X' : Math.floor(xIn / tileSize),
		 'Y' : Math.floor(yIn / tileSize) }
}

function roundNumber(num, dec) {
	return Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
}

function randomInt(X) {
	return Math.floor(X * (Math.random() % 1));
}

function randomBetween(minVal, maxVal) {
		return minVal + randomInt(maxVal - minVal + 1);
}	

function boxIntersection(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2)
{
	if (ax1 >= bx1 && ax2 <= bx2 && ay1 >= by1 && ay2 <= by2)
		return true;
		
	if (bx2 < ax1 || bx1 > ax2) return false;
	if (by2 < ay1 || by1 > ay2) return false;
	
	return true;
}

function clamp (min, max) {
  return Math.min(Math.max(this, min), max);
}

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};


function boxOverlapFactor(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2)
{
	var mx1 = ax1;
	var my1 = ay1;
	var mx2 = ax1;
	var my2 = ay1;
	
	mx1 = ax1 >= bx1 ? ax1 : bx1;
	my1 = ay1 >= by1 ? ay1 : by1;
	mx2 = ax2 <= bx2 ? ax2 : bx2;
	my2 = ay2 <= by2 ? ay2 : by2;
	
	var mx = mx2 - mx1;
	var my = my2 - my1;
	
	var ax = ax2 - ax1;
	var ay = ay2 - ay1;
	
	return Math.sqrt(mx * my) / Math.sqrt(ax * ay);
}

function isPlaceable(x,y) {
	if (tiles[x][y] == tileType.FLOOR || tiles[x][y] == tileType.SLIME || tiles[x][y] == tileType.BLAST)
		return true;
	else
		return false;
}

function isCollide (x, y) {
	if (tiles[x][y] == tileType.WALL || tiles[x][y] == tileType.BARREL || tiles[x][y] == tileType.UNBREAKABLE || tiles[x][y] == tileType.BOMBMOVE)
		return true; 	
	else
		return false;					
}

function isBreakable (x,y){
	if (tiles[x][y] == tileType.WALL || tiles[x][y] == tileType.BARREL)
		return true; 	
	else
		return false;		
}

function px2tile(x) {
	return Math.round(x / tileSize);
}

function tile2px(x) {
	return x * tileSize;
}

function getBomb(x,y) {

	for (index = 0; index < bombs.length; index++ ){

		if (bombs[index].x == tile2px(x) &&  bombs[index].y == tile2px(y)) {
			return index;
		}
	}

	return -1;
}