"use strict";

var canvas_ns = function() {

	var canvas, context, width, height, current_point;

	var canvas_init = function() {
		canvas = document.getElementById("fractal");
		context = canvas.getContext("2d");
		current_point = new Point(0, 0);
	};

	var step = function(){
		context.fillStyle = probability_pick(colors, Math.random());
		current_point = probability_pick(probability_transforms, Math.random())(current_point);
		draw_point(math_coord2canvas_coord(current_point));
		
	};

	var draw_point = function(point){
		context.fillRect(point.x, point.y, 2, 2);
	};

	var canvas_resize = function() {
		canvas.width = width = window.innerWidth;
		canvas.height = height = window.innerHeight;
	};

	var Point = function(x, y){
		this.x = x;
		this.y = y;
	};

	var math_coord2canvas_coord = function(math_point){
		return new Point(100*math_point.x + width/2, (-60*math_point.y + height/2) + 250) ;
	};

	var affine_transform = function(point, a, b, c, d, e, f){
		/*
		[a, b] X [point.x] + [e]
		[c, d]   [point.y]   [f]
		Sorry in advance :{D
		*/
		return new Point(a*point.x+b*point.y+e, c*point.x+d*point.y+f);
	};

	//There is a more optimized way to do that but I feel like keeping the probability close to the transform.
	//And this way, this is the only thing to change in the code to make a new fractal if I feel like doing so in the future. I'd refactor first.
	var probability_transforms =  [
		{ "probability": 0.01, "item": function(point){ return affine_transform(point, 0, 0, 0, 0.16, 0, 0) }},
		{ "probability": 0.85, "item": function(point){ return affine_transform(point, 0.85, 0.04, -0.04, 0.85, 0, 1.6) }},
		{ "probability": 0.07, "item": function(point){ return affine_transform(point, 0.2, -0.26, 0.23, 0.22, 0, 1.6) }},
		{ "probability": 0.07, "item": function(point){ return affine_transform(point, -0.15, 0.28, 0.26, 0.24, 0, 0.44) }}
	];

	var colors = [
		{ "probability": 0.30, "item": "#AFE827" },
		{ "probability": 0.30, "item": "#27E84E" },
		{ "probability": 0.30, "item": "#66FF38" },
		{ "probability": 0.05, "item": "#FFF42B" },
		{ "probability": 0.05, "item": "#3FFFAF" }
	];

	var probability_pick = function(elements, random_number){
		//Reverse for loop is faster: https://blogs.oracle.com/greimer/resource/loop-test.html
		var probability_sum = 0;
		for (var i = elements.length - 1; i >= 0; i--) {
			probability_sum += elements[i].probability
			if(probability_sum >= random_number){
				return elements[i].item;
			}
		}
		throw "Oops. Either your probabilities sum to less than 1 or you're passing a random number bigger than one.";
	};


	canvas_init();
	canvas_resize();
	//Let the JS scheduler handle it.
	setInterval(step, 1);
};


window.onload = function(){
	setTimeout(canvas_ns, 0);
};