var Animate = window.requestAnimationFrame;

var Update = function(){
	ClearScreen();
	context.drawImage(pics.background, 0, 0, 754, 194, 0, 0, canvas.width, canvas.height);
	player.Update();
	DrawPlatforms();
	Animate(Update);
};

Update();
