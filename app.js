var pics = {
	player: new Image(),
	background: new Image(),
	SetPics: function(){
		this.player.src = "images/player.png";
		this.background.src = "images/hills.png";
	}
};
pics.SetPics();

var ClearScreen = function(){
	context.clearRect(0, 0, canvas.width, canvas.height);
};

function DrawPlatforms(){
	for (var i = 0; i < platforms.length; i++){
		platforms[i].Draw();
	}
}

platforms.push(
{
	x: 0, y: grid * 12, width: grid * 22, height: grid * 3, 
	Draw: function(){
		context.strokeStyle = "black";
		context.fillStyle = "green";
		context.strokeRect(this.x, this.y, this.width, this.height);
		context.fillRect(this.x, this.y, this.width, this.height);
	}
});


/*Create player. Sprites are 150 x 184.
Stand still sx 0; 	Jump sx 151; 	Fall sx 301; 	Jump Shoot sx 451;
Fall Shoot sx 601; Shoot sx 751; 
Right sy is 0, Left sy is 552.
********************************************
Run sx frames are 0, 151, 301, and 451.
Right Run sy is 185 and Run-shoot sy is 369.
Left Run sy is 737 and Run-shoot sy is 921.*/
player = {
	img: pics.player,
	force: 0,
	counter: 0,
	rate: 4,
	speed: grid * 0.1,
	weight: grid * 0.03,
	x: grid * 10,
	y: grid * 4,
	width: grid * 2.5,
	height: grid * 3.3,
	sx: 0,
	sy: 0,
	swidth: 150,
	sheight: 184,
	collx: this.x + (grid * 0.5),
	colly: this.y,
	collwidth: grid * 2,
	collheight: grid * 2.5,
	dir: "right",
	move: false,
	left: false,
	right: false,
	shoot: false,
	StandRight: function(){
		this.sx = 0;
		this.sy = 0;
	},
	StandLeft: function(){
		this.sx = 0;
		this.sy = 552;
	},
	JumpRight: function(){
			//do jump animation.
			if (this.force >= gravity){
				this.sx = 151;
				this.sy = 0;
			}
			else if (this.force > 0){
				this.sx = 301;
				this.sy = 0;			
			}
	},
	JumpLeft: function(){
			//do jump animation.
			if (this.force >= gravity){
				this.sx = 151;
				this.sy = 552;				
			}
			else if (this.force > 0){
				this.sx = 301;
				this.sy = 552;			
			}		
	},
	Jump: function(){
		if (this.force <= 0){
			this.force = 29;
		}
	},
	Gravity: function(){
		this.y += (gravity - this.force) * this.weight;
		if (this.force > 0){
			this.force--;
		}
		else{
			this.force = 0;
		}
	},
	Move: function(){
		//detect movement.
		if (this.left == false && this.right == false){this.move = false;}
		//do not fall through platforms.
		if (this.HitPlatform() != false && this.force <= 0){
			this.y = this.HitPlatform() - this.collheight;
			if (this.move == false){
				if (this.dir == "right"){
					this.StandRight();
				}
				else{
					this.StandLeft();
				}				
			}
		}
		//move player right
		if (this.right == true){
			this.dir = "right";
			this.sy = 185;
			this.x += this.speed;
			//right animation
			if (this.counter == 1){
				this.sx += 150;
			}
			if (this.sx > 500){
				this.sx = 0;
			}
		}
		//move player left
		else if (this.left == true){
			this.dir = "left";
			this.sy = 737;
			this.x -= this.speed;
			//left animation
			if (this.counter == 1){
				this.sx += 150;
			}
			if (this.sx > 500){
				this.sx = 0;
			}			
		}
		if (this.dir == "right"){this.JumpRight();}
		if (this.dir == "left"){this.JumpLeft();}
	},
	HitPlatform: function(){
		var collide = false;
		for (var i = 0; i < platforms.length; i++){
			if (this.collx + this.collwidth >= platforms[i].x && this.collx <= platforms[i].x + platforms[i].width &&
				this.colly + this.collheight >= platforms[i].y && this.colly <= platforms[i].y + platforms[i].height){
				collide = platforms[i].y;
			}
		}
		return collide;
	},
	FallOffScreen: function(){
		if (this.y > canvas.height * 1.05){
			//Instead of reloading the page, display "Game Over" and restart the game properly.
			location.reload();			
		}
	},
	Shoot: function(){},
	Draw: function(){
		context.drawImage(this.img, this.sx, this.sy, this.swidth, this.sheight, this.x, this.y, this.width, this.height);
	},
	Update: function(){
		//use the counter to control the speed of animations.
		this.counter++;
		if (this.counter > this.rate){this.counter = 0;}
		//synch the collision box with the player's position.
		this.collx = this.x + (grid * 0.5);
		this.colly = this.y;
		//Apply rules of gravity.
		this.Gravity();
		//Check to see if player has fallen off screen.
		this.FallOffScreen();
		//Move the player.
		this.Move();
		//draw the player onto the screen.
		this.Draw();
	}
};

window.addEventListener("keydown", function(event){
	if (event.keyCode == 38){
		player.Jump();
	}	
	if (event.keyCode == 37){
		player.move = true;
		player.left = true;
		player.right = false;
	}	
	if (event.keyCode == 39){
		player.move = true;
		player.right = true;
		player.left = false;
	}
	if (event.keyCode == 32){
		player.shoot = true;
		player.Shoot();
	}
});

window.addEventListener("keyup", function(event){
	if (event.keyCode == 37){
		player.left = false;
		player.StandLeft();
	}
	if (event.keyCode == 39){
		player.right = false;
		player.StandRight();
	}	
	if (event.keyCode == 32){
		player.shoot = false;
	}
});

