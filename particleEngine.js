
var particleEngine = new (function() {
								   
				var that = this;
					function Particle(posX, posY) {
						var that = this;
						
						that.positionX = (posX) + randomBetween(-1.0, 1.0);
						that.positionY = (posY) + randomBetween(-1.0, 1.0);
												
						that.directionX = randomBetween(-.6,1.2);
						that.directionY = randomBetween(-.6,1.2);
						that.life = randomBetween(10,35);
						that.size = randomBetween(8, 15);
						that.alpha = randomBetween(.01,.12);	
						
						that.texturePick = randomBetween(1, 5);
					}					
					that.particles = [];
					
					that.particleTexture = new Image();
					that.particleTexture.src = "whiteDot.png";
					
					that.particleTextureRed = new Image();
					that.particleTextureRed.src = "redDot.png";
					
					that.maxParticles = 5000,
					that.active = true;
					that.particleCount = 0;
					
					
					that.add = function(positionX, positionY) {
						spawnCount = randomBetween(90, 240 );
						if ( spawnCount + that.particleCount > that.maxParticles) {
							spawnCount = (that.maxParticles - that.particleCount) / 1.2;
						}			
						
						while (spawnCount > 0) {
							that.addPart(positionX, positionY);
							spawnCount--;
						}
					}
					
					that.addPart = function(positionX, positionY) {
						if (that.particleCount >= that.maxParticles ) return;
						
						var part = new Particle(positionX, positionY);
						
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
							 	
								var grad = ctx.createRadialGradient(255,255,255,0,0,0);
								grad.addColorStop( 0, 'rgba(255,255,255,1)' );   
								grad.addColorStop( 1, 'rgba(0,0,0,0)' ); 
								ctx.fillStyle = grad;
								
							 	
								
								 if (that.particles[particleIndex].texturePick == 2) {
									 ctx.globalAlpha = that.particles[particleIndex].alpha / 1.4;
									ctx.drawImage(that.particleTextureRed, 0,0, 32, 32,that.particles[particleIndex].positionX, that.particles[particleIndex].positionY, that.particles[particleIndex].size, that.particles[particleIndex].size); 
								 }
								 else {
									 ctx.globalAlpha = that.particles[particleIndex].alpha;
									 ctx.drawImage(that.particleTexture, 0,0, 32, 32,that.particles[particleIndex].positionX, that.particles[particleIndex].positionY, that.particles[particleIndex].size, that.particles[particleIndex].size);
								 }
								
							}
						}
						ctx.globalAlpha = 1;   // Full opacity
					}
				
				})();