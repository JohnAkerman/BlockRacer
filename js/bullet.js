function Bullet(x,y,owner, angle, maxX, maxY, colour) {
	this.owner = owner;
	this.x = x;
	this.y = y;
	this.active = true;
	this.angle = angle;
	this.speed = 5;
	this.vx = 0;
	this.vy = 0;
	this.maxX = maxX;
	this.maxY = maxY;
	this.colour = colour;
	this.life = 2000;
	this.bounceAmount = 0;
	this.bounceMax = 3;

	
	this.update = function(delta) {
		if (this.active) {
				this.vx = -Math.sin(this.angle * Math.PI / 180) * this.speed;
				this.vy = Math.cos(this.angle* Math.PI / 180) * this.speed;
				
				this.x -= this.vx;
				this.y -= this.vy;		

				this.life--;

				if (this.life <= 0)
					this.die();
		}
	};

	this.checkBounds = function() {
		if (this.x < 0 || this.y < 0 || this.x > this.maxX || this.y > this.maxY) {
			if (this.bounceAmount < this.bounceMax) {
				this.vx *= -1;
				this.vy	*= -1;
				this.speed *= -1;
				this.bounceAmount++;
			}else
				this.die();
		}
		else
			return false;
	};

	this.die = function() {
		this.active = false;

		for (var a = 0; a < playerlist.length; a++) {
			if (playerlist[a].name == this.owner)
				playerlist[a].bulletAmount--;			
		}
	};

	this.render = function() {
		if (this.active) {
			ctx.save();
			ctx.translate(this.x,this.y);
			ctx.rotate(this.angle * Math.PI / 180);

			if (this.colour == 0)
				ctx.fillStyle="red";
			else if (this.colour == 1)
				ctx.fillStyle="yellow";
			else if (this.colour == 2)
				ctx.fillStyle="green";
			else if (this.colour == 3)
				ctx.fillStyle="blue";

			ctx.fillRect(0,0,2,5);
			ctx.restore();
		}		
	};
}