var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs') 

app.listen(8080);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}

// Arrays
var playerlist = [];	
var clientids = [];

function Player(name, x,y, frame) {
	this.x = x;
	this.y = y;
	this.name = name;	
	this.frame = frame;	
}		
  /*
	
	// send to current request socket client aka emitting to server
 socket.emit('message', "this is a test");

 // sending to all clients, include sender
 io.sockets.emit('message', "this is a test");

 // sending to all clients except sender
 socket.broadcast.emit('message', "this is a test");

 // sending to all clients in 'game' room(channel) except sender
 socket.broadcast.to('game').emit('message', 'nice game');

  // sending to all clients in 'game' room(channel), include sender
 io.sockets.in('game').emit('message', 'cool game');

 // sending to individual socketid
 io.sockets.socket(socketid).emit('message', 'for your eyes only');

  */
io.sockets.on('connection', function (socket) {  
	
	// Create player on server and add to array
	socket.on('initPlayer', function (playerName,x,y, frame) {
		socket.clientname = playerName;
		var player = new Player(playerName,x,y, frame);
		playerlist.push(player);
		clientids.push(socket.id);		
		io.sockets.emit("joinAnnounce", playerName);				
		io.sockets.emit('addplayer',playerlist, playerName,x,y, frame);	   
	});
  
	// When server recieves a moveplayer command, broadcast it to players
	socket.on("moveplayer", function (pName, playerX, playerY) {
		socket.broadcast.emit("playermove", pName, playerX, playerY);
	});
	
	socket.on("sendkey", function(pName, key, value) {
		socket.broadcast.emit("setkey", pName, key, value);
	});
	
	socket.on("resyncplayer", function (pName, playerx, playery, angle, speed, health) {
		socket.broadcast.emit("syncplayer", pName, playerx,playery, angle, speed, health);		
		socket.emit("syncPlayerStats", 3.5,-2,0.05,0.15,0.1,4);							
	});    
	
	socket.on("sendrefresh", function (a) {
		io.sockets.emit("forcerefresh", a);
	});

	socket.on("sendBullet", function(p) {
		socket.broadcast.emit("createBullet", p);
	});

	  
	socket.on('disconnect', function(){
		io.sockets.emit('killplayer',socket.clientname);
		delete playerlist[socket.clientname];
		delete clientids[socket.id];
		
		for(var i in playerlist) {
			if(playerlist[i].name == socket.clientname) 
				playerlist.splice(i, 1);			
		}
				
		for(var i in clientids) {
			if(clientids[i] == socket.id) 
				clientids.splice(i, 1);
		}
	});   
});


 