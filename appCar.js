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
	this.clipXMin = 15 * frame;
	this.clipXMax = 15 * frame + 15;
}		

  
io.sockets.on('connection', function (socket) {  
	
	// Create player on server and add to array
	socket.on('initPlayer', function (playerName,x,y, frame) {
		socket.clientname = playerName;
		var player = new Player(playerName,x,y, frame);
		playerlist.push(player);
		clientids.push(socket.id);		
		io.sockets.emit("joinAnnounce", playerName);
		//socket.broadcast.emit("joinAnnounce", playerName);
		io.sockets.emit('addplayer',playerlist, playerName,x,y); // add player on everyones screen
	   // io.sockets.emit("joinSync",playerlist,x,y);
	});
  
  
	// When server recieves a moveplayer command, broadcast it to players
	socket.on("moveplayer", function (pName, playerX, playerY) {
		socket.broadcast.emit("playermove", pName, playerX, playerY);
	});
	
	socket.on("resyncplayer", function (pName, playerx, playery) {
		socket.broadcast.emit("syncplayer", pName, playerx,playery);
	});    
  
	socket.on('disconnect', function(){
		io.sockets.emit('killplayer',socket.clientname);
		delete playerlist[socket.clientname];
		delete clientids[socket.id];
		
		for(var i in playerlist) {
			if(playerlist[i].name == socket.clientname) {
				playerlist.splice(i, 1);
			}
		}
				
		for(var i in clientids) {
			if(clientids[i] == socket.id) {
				clientids.splice(i, 1);
			}
		}
	});   
});


 