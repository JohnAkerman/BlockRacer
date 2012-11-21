function skid(x,y, angle) {
	this.x = x;
	this.y = y;				
	this.timer = 2;
	this.active = true;
	this.angle = angle;				
}	

function renderSkids(delta) {
	for (var skid = 0; skid < skidList.length; skid++) {
		if (skidList[skid].active) {
			ctx.save();
			ctx.globalAlpha = skidList[skid].timer;
			ctx.translate(skidList[skid].x,skidList[skid].y-2);
			ctx.rotate(skidList[skid].angle * Math.PI/180);
			ctx.drawImage(skidBitmap, skidX,-2);
			ctx.restore();
			ctx.globalAlpha = 1;
		}
	}
}

var skidX = -6;

function addSkid(x,y,angle) {
	var s = new skid(Math.round(x),Math.round(y), angle);
	skidList.push(s);
}
