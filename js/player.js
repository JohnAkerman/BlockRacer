function Player(name, x,y, frame) {
	this.x = x;
	this.y = y;
	this.vx = 0.0;
	this.vy = 0.0;				
	this.topSpeed = 3.5;	
	this.topSpeedRev = -2;
	this.friction = 0.05;		
	this.acc = 0.15;
	this.speed = 0.0;				
	this.name = name;
	this.frame = frame;
	this.angle = 0;
	this.reverse = 0.1;
	this.width = 14;
	this.height = 24;				
	this.grip = 3.5;
	this.minGrip = 4;
	this.handle = 4;
	this.brake = 0.125;
	this.skidSpeed = 0.1;
	this.skidding = false;
	this.drift = 0;		
	this.bulletAmount = 0;
	this.bulletMax = 10;	

	this.keys = [];
	this.keys[KEYNAMES.LEFT] = false; // left
	this.keys[KEYNAMES.RIGHT] = false; // right
	this.keys[KEYNAMES.UP] = false; // up
	this.keys[KEYNAMES.DOWN] = false; // down	
	this.keys[KEYNAMES.SPACE] = false;
	this.keys[KEYNAMES.X] = false;
	
	this.leftAllowed = this.rightAllowed = this.upAllowed = this.downAllowed = this.spaceAllowed = this.xAllowed = true;

	this.health = 100;

	this.damage = function(amount) {
		this.health -= amount;
		if (this.health <= 0)
			respawnClient(this);
	}

	this.respawn = function() {
		this.health = 100;
		this.vx = 0;
		this.vy = 0;
		this.speed = 0.0;
		this.angle = Math.round(Math.random() * 180);
		this.x = Math.round(Math.random() * width) - 1;
		this.y = Math.round(Math.random() * height) - 1;

		resync(this);
	}
}