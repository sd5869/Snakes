$(document).ready(function(){
	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	
	//save the cell width 
	var cw = 10;
	var d;
	var food;
	var score;
	
	// create the snake 
	var snake_array; //array of cells to make the snake
	
	function init()
	{
		d = "down"; //initial direction
		create_snake();
		create_food(); //Now we can see the food particle
		//display the score
		score = 0;
		
		//move the snake now using a timer
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 70);
	}
	init();
	
	function create_snake()
	{
		var length = 4; //Start Length of the snake
		snake_array = []; 
		for(var i = length-1; i>=0; i--)
		{
			//a horizontal snake starting from the top left
			snake_array.push({x: i, y:0});
		}
	}
	
	
	function create_food()
	{
		food = {
			x: Math.round(Math.random()*(w-cw)/cw), 
			y: Math.round(Math.random()*(h-cw)/cw), 
		};
		//This will create a cell with (x,y) between 0-44
		
	}
	
	//paint the snake
	function paint()
	{
		//To avoid the snake trail we paint the canvas on every frame
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);
		
		//The movement code for the snake to come here.
		//Pop out the tail cell and place it infront of the head cell
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;
		//These were the position of the head cell.
		//We will increment it to get the new head position
		if(d == "right") nx++;
		else if(d == "left") nx--;
		else if(d == "up") ny--;
		else if(d == "down") ny++;
		//if the head of the snake bumps into wall, the game will restart
		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw||check_collision(nx, ny, snake_array))
		{
			//restart game
			init();
			return;
		}		
		//the code to make the snake eat the food
		//If the new head position matches with that of the food,
		// We Create a new head instead of moving the tail
		if(nx == food.x && ny == food.y)
		{
			var tail = {x: nx, y: ny};
			score++;
			//Create new food
			create_food();
		}
		else
		{
			var tail = snake_array.pop(); //pop out the last cell
			tail.x = nx; tail.y = ny;
		}
	
		
		snake_array.unshift(tail); //put back the tail as the first cell
		
		for(var i = 0; i < snake_array.length; i++)
		{
			var c = snake_array[i];
			//Lets paint 10px wide cells
			paint_cell(c.x, c.y,0);
		}
		
		// paint the food
		paint_cell(food.x, food.y,1);
		//Lets paint the score

		var score_text = "Score: " + score;
		ctx.font = "20px Georgia";
		ctx.fillStyle = "#ffff00";
		ctx.fillText(score_text, 5, h-5);
	}
	
	//create a generic function to paint cells
	function paint_cell(x, y,p)
	{	if (p==0)
			ctx.fillStyle = "#00ff00";
		else
			ctx.fillStyle = "#ff0000";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "black";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}
	
	function check_collision(x, y, array)
	{
		//This function will check if the provided x,y coordinates exist
		//in an array of cells or not
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}
	
	//add the keyboard controls now
	$(document).keydown(function(e){
		var key = e.which;
		//add a clause to prevent reverse gear
		if(key == "37" && d != "right") d = "left";
		else if(key == "38" && d != "down") d = "up";
		else if(key == "39" && d != "left") d = "right";
		else if(key == "40" && d != "up") d = "down";
	})	
})