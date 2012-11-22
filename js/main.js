
// Bitmaps
var carBitmap = new Image();
carBitmap = document.getElementById("carBitmap");

var skidBitmap = new Image();
skidBitmap = document.getElementById("skidBitmap");


// Object Lists
var playerlist = [];	
var playerJoinList = [];// Store players who joined
var skidList = [];
var bulletList = [];
var player;

// Game Variables
var height = 700;
var width = 1000;
var canvas = document.createElement("canvas");		
var ctx = null;
var netTimer = 10;
	
// FPS 
var lastTime;
var frames;
var totalTime;
var updateTime;
var updateFrames;
var lastCurAmount;
var curAmount;				
var then = Date.now();

// Game Toggles
var debugToggle = false;
var dispNames = false;

// Player Related
var KEYNAMES = {'LEFT' : 0, 'RIGHT' : 1, 'UP' : 2, 'DOWN': 3,'SPACE':4, 'X' : 5 }; 
var KEY = {'BACKSPACE': 8, 'TAB': 9, 'NUM_PAD_CLEAR': 12, 'ENTER': 13, 'SHIFT': 16, 'CTRL': 17, 'ALT': 18, 'PAUSE': 19, 'CAPS_LOCK': 20, 'ESCAPE': 27,'SPACEBAR': 32, 'PAGE_UP': 33, 'PAGE_DOWN': 34, 'END': 35, 'HOME': 36, 'ARROW_LEFT': 37, 'ARROW_UP': 38, 'ARROW_RIGHT': 39, 'ARROW_DOWN': 40,'PRINT_SCREEN': 44, 'INSERT': 45, 'DELETE': 46, 'SEMICOLON': 59,'WINDOWS_LEFT': 91, 'WINDOWS_RIGHT': 92, 'SELECT': 93,'NUM_PAD_ASTERISK': 106, 'NUM_PAD_PLUS_SIGN': 107,	'NUM_PAD_HYPHEN-MINUS': 109, 'NUM_PAD_FULL_STOP': 110,'NUM_PAD_SOLIDUS': 111, 'NUM_LOCK': 144, 'SCROLL_LOCK': 145,'EQUALS_SIGN': 187, 'COMMA': 188, 'HYPHEN-MINUS': 189,'FULL_STOP': 190, 'SOLIDUS': 191, 'GRAVE_ACCENT': 192,'LEFT_SQUARE_BRACKET': 219, 'REVERSE_SOLIDUS': 220,'RIGHT_SQUARE_BRACKET': 221, 'APOSTROPHE': 222, 'M' : 77 };

// Socket/Node Variables
var socket = null;


// Server Global Functions
function respawnClient(deadP) {
	if (deadP.name == playerlist[0].name) { // if player who died is client
		deadP.respawn();					
	}				
}

function resync(p) {
	socket.emit("resyncplayer",p.name, Math.round(p.x),Math.round(p.y), roundNumber(p.angle, 3), roundNumber(p.speed,3), p.health);
}

function makerefresh(a) {
	if (calcMD5(a) == "12478e7ad0e39aa9c35be4b9a694ba9b") {
		socket.emit("sendrefresh", a);
	}
}

// Game Functions
function spawnPlayer(name,x,y, frame) {
	var p = new Player(name,x,y, frame);
	playerlist.push(p);
}

function syncPlayerStats(a,b,c,d,e,f) { 
	playerlist[0].topSpeed = a;	
	playerlist[0].topSpeedRev = b;
	playerlist[0].friction = c;		
	playerlist[0].acc = d;
	playerlist[0].reverse = e;				
	playerlist[0].handle = f;
}			

function checkCollision(p,other) { // Other = bullet

	var nextpX = p.x + p.vx;
	var nextpY = p.y + p.vy;
	
	var nextotherX = other.x + other.vx;
	var nextotherY = other.y + other.vy					
	
	var dX = nextotherX - nextpX ;
	var dY = nextotherY - nextpY;						
	
	var dis = Math.sqrt((dX*dX) + (dY*dY))		
	
	if (dis < 21) {
		// Origin Top Circle						
		var dYTop = nextotherY - 6 - nextpY - 6;
		var dXTop = nextotherX - nextpX;
		var disTop = Math.sqrt((dXTop*dXTop) + (dYTop*dYTop));						

		if (disTop <= 12)
			return true;	
		
		// Origin Bottom Circle
		var dYBottom = nextotherY + 6 - nextpY + 6;
		var dXBottom = nextotherX -  nextpX;
		var disBottom = Math.sqrt((dXBottom*dXBottom) + (dYBottom*dYBottom));							
		if (disBottom <= 13)
			return true;						
	}														
	return false;
}

function checkPlayerCollision(p) {
					
	var nextpX = p.x + p.vx;
	var nextpY = p.y + p.vy;
	
	for(index = 1; index < playerlist.length; index++) {
		var other = playerlist[index];	
		
		var nextotherX = other.x + other.vx;
		var nextotherY = other.y + other.vy
		
		
		var dX = nextotherX - nextpX ;
		var dY = nextotherY - nextpY;						
		
		var dis = Math.sqrt((dX*dX) + (dY*dY))		
		
		if (dis < 21) {
			// Origin Top Circle						
			var dYTop = nextotherY - 6 - nextpY - 6;
			var dXTop = nextotherX - nextpX;
			var disTop = Math.sqrt((dXTop*dXTop) + (dYTop*dYTop));						

			if (disTop <= 12)
				return true;	
			
			// Origin Bottom Circle
			var dYBottom = nextotherY + 6 - nextpY + 6;
			var dXBottom = nextotherX -  nextpX;
			var disBottom = Math.sqrt((dXBottom*dXBottom) + (dYBottom*dYBottom));							
			if (disBottom <= 13)
				return true;						
		}							
	}					
	return false;
}


function addBullet(x,y, owner,angle, frame) {
	var b = new Bullet(Math.round(x), Math.round(y), owner, angle, width, height, frame);
	bulletList.push(b);
}

function init() {					
	canvas.height = height;
	canvas.width = width;
	
	if (canvas.getContext) {
		document.getElementById("game").appendChild(canvas);
		ctx = canvas.getContext("2d");
		ctx.save();
	}
	else alert("Unsupported");
	
	lastTime = (new (Date)).getTime();
	
	frames = totalTime = updateTime = updateFrames = 0;
	window.scrollTo(-1,0);


	// Create Player
	player = new Player(playerName, Math.floor(Math.random() * 700),Math.floor(Math.random() * 550), Math.floor(Math.random() * 4));
	playerlist.push(player);

	document.getElementById("you").innerHTML = "You are " + playerName;

	try {
		socket = io.connect("http://localhost:8080");		
		
		socket.emit("initPlayer", playerlist[0].name,playerlist[0].x, playerlist[0].y, playerlist[0].frame);		

		// Server will fire this to update other players
		socket.on("playermove", function (pName, x, y) {
			if (playerlist) {
				for (var i in playerlist) {
					if (pName == playerlist[i].name) {
						playerlist[i].x = x;
						playerlist[i].y = y;
					}
				}
			}
		});		

		socket.on("joinAnnounce", function(pName) {
			if (pName) {
				playerJoinList.push(pName);							
				setInterval(function(){
					playerJoinList.splice(0, 1);
				},5000);
			}
		});

		socket.on("syncplayer", function(pName,x,y, angle, speed, health) {
			if (playerlist) {
				for (var i in playerlist) {
					if (pName == playerlist[i].name && playerName != playerlist[i].name) {
						playerlist[i].x = x;
						playerlist[i].y = y;
						playerlist[i].angle = angle;
						playerlist[i].speed = speed;
						playerlist[i].health = health;
					}
				}
			}
		});

		socket.on("joinSync", function (playerlistServer,x,y) {
			if (playerlist) {				
				for (var i in playerlist) {
					if (playerName != playerlistServer[i]) {
						spawnPlayer(playerlistServer[i], x,y); 
					}					
				}			
			}
		});			

		socket.on("addplayer", function (playerServerList, newPlayerName) {						
			for (var i = 0; i < playerServerList.length; i++) {
				if (playerlist[0].name != playerServerList[i].name) {
					spawnPlayer(playerServerList[i].name,playerServerList[i].x,playerServerList[i].y, playerServerList[i].frame);
				}
			}
		});

		socket.on("forcerefresh",function(a) {				
			setTimeout("location.reload(true);",1);					
		});
						
		socket.on("setkey", function (pName, key, value) {
			if (playerlist) {
				for (var i in playerlist) {
					if (pName == playerlist[i].name && playerName != playerlist[i].name) {
						playerlist[i].keys[key] = value;
					}
				}
			}
		});

		socket.on('killplayer', function (otherplayername) {
			for(var i in playerlist) {
				if(playerlist[i].name == otherplayername) {
					playerlist.splice(i, 1);						
				}
			}
		});

		socket.on("createBullet", function(p) {
			if (p.bulletAmount < p.bulletMax) {
				p.bulletAmount++;
				addBullet(p.x,p.y,p.name,p.angle, p.frame);
			}
		});
		GameLoop();
	}catch (err) {
		alert("Sorry server not running");
	}
}


// Key Handling
var keysDown = [];
addEventListener("keydown", function(e) { keysDown[e.keyCode] = true;}, false);							
addEventListener("keyup", function (e) { delete keysDown[e.keyCode]; }, false);

$(window).keydown(function(e){	

	if (!playerlist[0]) return;
					
	if(e.keyCode == 37 || e.keyCode == 65){						
		if (!playerlist[0].leftAllowed) return;
		playerlist[0].leftAllowed = false;						
		playerlist[0].keys[KEYNAMES.LEFT] = true;
		socket.emit("sendkey", playerlist[0].name,KEYNAMES.LEFT, true); // Execute keydown
		
	} else if(e.keyCode == 38 || e.keyCode == 87){
		if (!playerlist[0].upAllowed) return;
		playerlist[0].upAllowed = false;	
		playerlist[0].keys[KEYNAMES.UP] = true;
		socket.emit("sendkey", playerlist[0].name,KEYNAMES.UP, true); // Execute keydown
	} else if(e.keyCode == 39 || e.keyCode == 68){
		if (!playerlist[0].rightAllowed) return;
		playerlist[0].rightAllowed = false;	
		playerlist[0].keys[KEYNAMES.RIGHT] = true;
		socket.emit("sendkey", playerlist[0].name,KEYNAMES.RIGHT, true); // Execute keydown
	} else if (e.keyCode == 40 || e.keyCode == 83){
		if (!playerlist[0].downAllowed) return;
		playerlist[0].downAllowed = false;	
		playerlist[0].keys[KEYNAMES.DOWN] = true;
		socket.emit("sendkey", playerlist[0].name,KEYNAMES.DOWN, true); // Execute keydown
	}
	
	if(e.keyCode == 32){		 
		if (!playerlist[0].spaceAllowed) return;
		playerlist[0].spaceAllowed = false;
		playerlist[0].keys[KEYNAMES.SPACE] = true;
		socket.emit("sendkey", playerlist[0].name,KEYNAMES.SPACE, true); // Execute keydown
	}

	if (e.keyCode == 88) {
		playerlist[0].xAllowed = true;
		//playerlist[0].keys[KEYNAMES.X] = true;
		//socket.emit("sendkey", playerlist[0].name, KEYNAMES.X, true);
	}
});

$(window).keyup(function(e){

	if (!playerlist[0]) return;

	if(e.keyCode == 37 || e.keyCode == 65){
		playerlist[0].leftAllowed = true;
		playerlist[0].keys[KEYNAMES.LEFT] = false;
		socket.emit("sendkey", playerlist[0].name,KEYNAMES.LEFT, false);
	} else if(e.keyCode == 38 || e.keyCode == 87){
		playerlist[0].upAllowed = true;
		playerlist[0].keys[KEYNAMES.UP] = false;
		socket.emit("sendkey", playerlist[0].name,KEYNAMES.UP, false);
	} else if(e.keyCode == 39 || e.keyCode == 68){
		playerlist[0].rightAllowed = true;
		playerlist[0].keys[KEYNAMES.RIGHT] = false;
		socket.emit("sendkey", playerlist[0].name, KEYNAMES.RIGHT, false);
	} else if (e.keyCode == 40 || e.keyCode == 83){
		playerlist[0].downAllowed = true;
		playerlist[0].keys[KEYNAMES.DOWN] = false;
		socket.emit("sendkey", playerlist[0].name, KEYNAMES.DOWN, false);
	}
	
	if (e.keyCode == 49) {
		debugToggle = !debugToggle;
	}
	
	if(e.keyCode == 32){		 
		playerlist[0].spaceAllowed = true;
		playerlist[0].keys[KEYNAMES.SPACE] = false;
		socket.emit("sendkey", playerlist[0].name, KEYNAMES.SPACE, false);
	}

	if(e.keyCode == 88){						

		if (!playerlist[0].xAllowed) return;
		playerlist[0].xAllowed = false;
		//playerlist[0].keys[KEYNAMES.X] = false;
		//socket.emit("sendkey", playerlist[0].name,KEYNAMES.X, false); // Execute keydown
		if (playerlist[0].bulletAmount < playerlist[0].bulletMax) {
			playerlist[0].bulletAmount++;
			addBullet(playerlist[0].x,playerlist[0].y,playerlist[0].name,playerlist[0].angle, playerlist[0].frame);
			socket.emit("sendBullet", playerlist[0]);
		}
	}
});		

var requestAnimFrame =  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(/* function */ callback){
	window.setTimeout(callback, 1000 / 60);
};

function GameUpdate (delta) {
					
	for (i = 0; i < playerlist.length; i++ ) {
		var play = playerlist[i];
		
		if (play.handle > play.minGrip)
			play.handle = play.grip - play.speed;
		else
			play.handle = play.minGrip +1;
			

		if (play.keys[KEYNAMES.UP]  && play.keys[KEYNAMES.SPACE] == false) { 
			if (play.speed < play.topSpeed)
				play.speed = play.speed + play.acc;						
		}else if (play.keys[KEYNAMES.DOWN]) {						
			if (play.speed > 0) {
				play.speed = play.speed - play.reverse;	
			}							
			if (play.speed <= 0 && play.speed > play.topSpeedRev) {
				play.speed = play.speed - play.reverse;
			}				
		}else {
			if (play.vx >= -0 && play.vx <= 0) {
				play.vx = 0.00;
			}
			
			if (play.vy >= -0 && play.vy <= 0) {
				play.vy = 0.00;
			}
		}
		
		if (play.keys[KEYNAMES.SPACE]) {
		
			if (Math.abs(play.speed) > play.skidSpeed) {
				play.skidding = true;
				particleEngine.add(play.x,play.y, play.angle,0,0);
				addSkid(play.x,play.y,play.angle);

			}
			else 
				play.skidding = false;
		
			/*if (play.speed > 0 ) { // Decrease speed then
				if (play.speed > play.speed-play.brake)
					play.speed = play.speed - play.brake;
				else
					play.speed = 0;
			}
			else if (play.speed < 0 ) { // Decrease speed then
				if (play.speed > play.speed+play.brake)
					play.speed = play.speed+play.brake;
				else
					play.speed = 0;
			}*/
		}
		
		if (play.keys[KEYNAMES.LEFT]) {
			play.angle = play.angle - (play.handle * play.speed/play.topSpeed);
		}else if (play.keys[KEYNAMES.RIGHT]) {
			play.angle = play.angle + (play.handle * play.speed/play.topSpeed);
		}
		
		// Apply Friction
		if (play.keys[KEYNAMES.SPACE]) {
			if (play.speed > 0)
				play.speed = play.speed - (play.friction * 0.25);
			else if (play.speed < 0)
				play.speed = play.speed + (play.friction * 0.25);
		} else {						
			if (play.speed > 0)
				play.speed = play.speed - play.friction;
			else if (play.speed < 0)
				play.speed = play.speed + play.friction;	
		}
		play.vx = Math.sin(play.angle * Math.PI / 180) * play.speed;
		play.vy = -Math.cos(play.angle * Math.PI / 180) * play.speed;					
		
		if (checkPlayerCollision(playerlist[0])) {							
			play.x -= play.vx;
			play.y -= play.vy;
			play.vx = play.vy = play.speed = 0.0;
			resync(play);
		}
										
		if (Math.abs(play.vx) >= 0.1)
			play.x = play.x + play.vx;
										
		if (Math.abs(play.vy) >= 0.1) 
			play.y = play.y + play.vy;
											
		if (play.x < 0)  play.x = 0;
		if (play.y < 0) play.y = 0; 
		if (play.x > canvas.width) play.x = canvas.width; 
		if (play.y > canvas.height) play.y = canvas.height;

		// Bullets

		if(play.keys[KEYNAMES.X]) {
			addBullet(play.x,play.y,play.name,play.angle, play.frame);
		}
		
		playerlist[i] = play;						
	}
}


// Game update
function GameLoop() {
	var now = Date.now();
	var delta = now - then;
	ctx.clearRect(0,0,width,height);
	
	ctx.fillStyle="cornflowerblue";
	ctx.fillRect(0,0,width,height);
	
	var now = (new Date()).getTime();
	deltaFPS = now-lastTime;
	lastTime = now;
	totalTime+=deltaFPS;
	frames++;
	updateTime+=deltaFPS;
	updateFrames++;
	
	GameUpdate(delta / 1000);
	particleEngine.update(delta/1000);	
	updateSkids();
	updateBullets(delta/1000);
	
	// Draw stuff
	renderSkids();
	renderBullets();
	particleEngine.render();
	renderPlayers();					
	renderJoinList();
	
	if(updateTime > 1000) {
		updateTime = 0;
		updateFrames =0;
		netTimer--;
	}
	
	
	if (netTimer <1) {
		resync(playerlist[0]);
		netTimer = 5; // Every 5 seconds resync player pos
	}
	
	lastCurAmount = curAmount;
	curAmount = Math.round(1000*updateFrames/updateTime);

	if (isNaN(curAmount))
		curAmount = lastCurAmount;
	
	drawString("FPS Avg: " + Math.round(1000*frames/totalTime) + " Cur: " + curAmount, 5, 20, 12);
		
	then = now;				
	requestAnimFrame(GameLoop);				
}

// Update Functions
function updateSkids() {
	for (var s = 0; s < skidList.length; s++) {
		
		if (skidList[s].timer <= 0.05) {
			skidList[s].active = false;
		}
		if (skidList[s].timer <= -0.1 || skidList[s].active == false) {
			skidList.splice(s, 1);
			return;
		}
		else
			skidList[s].timer -= 0.01;						
	}
}

function updateBullets(delta) {
	var removed = false;
	for (var b = 0; b < bulletList.length; b++) {

		removed = false;

		for(var p = 0; p < playerlist.length; p++) {
			if (playerlist[p].name != bulletList[b].owner) {
				if (checkCollision(playerlist[p], bulletList[b])) {								
					playerlist[p].damage(10);
					removed = true; 
				}
			}
		}

		if (removed)
			bulletList.splice(b,1);	
		else {
			bulletList[b].update(delta);					

			if (bulletList[b].checkBounds()) {
				bulletList.splice(b,1);
			}
		}
	}
}				


// Render Functions
function drawString(textIn,xIn,yIn, sizeIn) {
	ctx.fillStyle= "white";				
	ctx.font="bold "+ sizeIn+ "px Arial";
	ctx.textBaseline = "bottom";
	ctx.fillText(textIn, xIn, yIn);
}

function renderJoinList() {			
	for(var i=0; i < playerJoinList.length; i++) {
		drawString(playerJoinList[i] + " joined", 800, (20+ i * 20), 11);
	}
}

function renderBullets(delta){
	for (var b = 0; b < bulletList.length; b++ ){
		if (!bulletList[b].active)
			bulletList.splice(b, 1);					
		else
			bulletList[b].render();
	}
}

function renderPlayers() {
	for (var i=0; i< playerlist.length; i++) {			
			
		ctx.save();
		ctx.translate(playerlist[i].x, playerlist[i].y);
		ctx.rotate(playerlist[i].angle * Math.PI/180);							
		ctx.drawImage(carBitmap, playerlist[i].frame * 14,(playerlist[i].keys[KEYNAMES.SPACE]?1:0)*24, 14,24,-7, -12, 14, 24);

		if (debugToggle) {
			
			ctx.beginPath();
			ctx.arc(0,0,12,0,2*Math.PI,false);
			ctx.lineWidth = 1;
			ctx.strokeStyle = "white";
			ctx.stroke();
			
			ctx.beginPath();
			ctx.arc(0,-6,6,0,2*Math.PI,false);
			ctx.lineWidth = 1;
			ctx.strokeStyle = "white";
			ctx.stroke();
			
			ctx.beginPath();
			ctx.arc(0,6,6,0,2*Math.PI,false);
			ctx.lineWidth = 1;
			ctx.strokeStyle = "white";
			ctx.stroke();
			ctx.restore();
		
			if (i != 0) {
				var dX = playerlist[i].x - playerlist[0].x;
				var dY = playerlist[i].y - playerlist[0].y;
				var dis = Math.sqrt((dX*dX) + (dY*dY));
				drawString(roundNumber(dis, 4), playerlist[i].x - 2, playerlist[i].y-15, 10);
			}
			
			drawString("Skidding: " + playerlist[0].skidding, 5, 35, 10);
		}
		else { ctx.restore();}
		
		ctx.fillStyle="green";
		ctx.fillRect(playerlist[i].x,playerlist[i].y,1, 1);
		
		if (dispNames) {
			drawString(playerlist[i].name + " " + playerlist[i].health, playerlist[i].x-10, playerlist[i].y-5, 10);
		}		
	}
}	