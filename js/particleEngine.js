
var particleEngine = new (function() {
								   
				var that = this;
					function Particle(posX, posY, angle, vX,vY) {
						var that = this;
						
						that.positionX = posX;
						that.positionY = posY;
						that.directionX = randomBetween(-.1,.1);
						that.directionY = randomBetween(-.1,.1);
						that.life = randomBetween(5,8);
						that.size = randomBetween(10, 25);
						that.alpha = randomBetween(.1,.3);	
						that.angle = angle;
					}		

					that.particles = [];
					
					that.particleTexture = new Image();
					that.particleTexture.src = "./images/whiteDot.png";
					
					that.particleTextureRed = new Image();
					that.particleTextureRed.src = "./images/redDot.png";
					
					that.maxParticles = 5000,
					that.active = true;
					that.particleCount = 0;
					
					
					that.add = function(positionX, positionY, angle, vX,vY) {
						spawnCount = randomBetween(25, 30 );
						if ( spawnCount + that.particleCount > that.maxParticles) {
							spawnCount = (that.maxParticles - that.particleCount) / 1.2;
						}			
						
						while (spawnCount > 0) {
							that.addPart(positionX, positionY, angle, vX, vY);
							spawnCount--;
						}
					}
					
					that.addPart = function(positionX, positionY, angle, vX,vY) {
						if (that.particleCount >= that.maxParticles ) return;
						
						var part = new Particle(positionX, positionY, angle, vX, vY);
						
						that.particles[that.particleCount] = part;
						that.particleCount++;
					
					}
						
					that.update = function(delta) {
						if (that.active == false || that.particleCount == 0) return;
						
						var particleIndex = 0;
						
						for (particleIndex = 0; particleIndex < that.particleCount; particleIndex++ ) {
							
							if (that.particles[particleIndex].life > 0) {
								that.particles[particleIndex].positionX += that.particles[particleIndex].directionX;
								that.particles[particleIndex].positionY += that.particles[particleIndex].directionY;
								that.particles[particleIndex].life -= (delta * 1);
								that.particles[particleIndex].alpha -= (delta * 1);
								that.particles[particleIndex].rotation += that.particles[particleIndex].rotationAdd;
							}
							else {
								if( particleIndex != that.particleCount - 1 ){
									that.particles[particleIndex ] = that.particles[ that.particleCount-1 ];
								}
								that.particleCount--;
							}						
						}
					}
					
					that.render = function() {
						if (that.active == false || that.particleCount == 0) return;
					
						for (particleIndex = 0; particleIndex < that.particleCount; particleIndex++ ) {
							if (that.particles[particleIndex].life <= 0 || that.particles[particleIndex].alpha <= 0) {
								if( particleIndex != that.particleCount - 1 ){
									that.particles[ particleIndex ] = that.particles[ that.particleCount-1 ];
								}
								that.particleCount--;
							} else {
								
								ctx.save();
								ctx.globalAlpha = that.particles[particleIndex].alpha;
								ctx.translate(that.particles[particleIndex].positionX, that.particles[particleIndex].positionY);
							 	ctx.rotate(that.particles[particleIndex].angle * Math.PI / 180);
								ctx.drawImage(that.particleTexture, 0,0, 32, 32,-5,0, that.particles[particleIndex].size, that.particles[particleIndex].size);
								ctx.restore();
							}
						}
						ctx.globalAlpha = 1;   // Full opacity
					}
				
				})();