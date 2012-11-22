BlockRacer
==========

A HTML 5 Multiplayer car game that uses Node.js and Socket.io

Current Implementation
----------------------

* Players define their name before joining.
* Car movement
* Ability to shoot bullets (not refined yet).
* Handbrake leave skidmarks.
* Majority of logic is completed on each client, network usage is compromised of sending key strokes and resyncing player values.

### ToDo

* Tile system used for track sprites and track collision.
* Refine shooting/bullet mechanic.

### Known Bugs
Bullets don't always reduce their owners bullet count, resulting in the player not having the ability to shoot any more bullets.


Usage
-----

Ensure the Start Server.bat file points to your location of BlockRacer, default is `c:\wamp\www\blockracer\node\node js/app.js`
Current code listens to port 8080.


### Car Controls

WASD/Arrow keys		-		Control car  
Spacebar 			-		Handbrake  
X					-		Shoot bullet (currently max of 10 at a time)