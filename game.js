class Field {
	constructor(canvas, next) {
	this.level = 1; //
	this.cnt = 0;//
	this.tick = 1000;//
	this.tickStep = 1.2;
	//this.nextFigure;
	this.width = canvas.width;
	this.height = canvas.height;
	this.step = canvas.width/10;
	this.x = canvas.width/this.step;
	this.y = canvas.height/this.step;
	this.canvas = canvas;
	this.next = next;//
	this.context = canvas.getContext("2d");
	this.nextContext = next.getContext("2d");
	//this.context.globalAlpha = 1;
	//this.context.fillStyle = "#000";
	//this.context.fillRect(0, 0, canvas.width, canvas.height);
	//this.drawGrid(this.context);
	this.gameOver = false;
	this.boolField = [];
	this.colorField = [];
	this.score = 0;
	for(let y = 0; y<this.y; y++)
	{
		this.boolField[y] = [];
		this.colorField[y] = [];
		for(let x = 0; x<this.x; x++)
		{
			this.boolField[y][x] = false;
			this.colorField[y][x] = 'rgb(0,0,0)';
		}
	}
	//this.startGame(this.context);
	
	this.indexNext = Math.floor(Math.random() * color.length);
	this.NewFigure(typeFigures, color);
	this.stop = true;
	//console.log(this.boolField);
	}
	
	destruct() {
		this.stopGame();
		document.onkeydown = function() {};
		document.onkeyup = function() {};
		this.startGame = function() {};
		this.stopGame = function() {};
		this.ticker = function() {};
	}
	
	get Tick() {
		return this.tick;
	}

	set Tick(value) {
		value = Math.floor(value);
		if(value>1000)
			this.tick = 1000;
		else if(value < 100)
			this.tick = 100;
		else
			this.tick = value;
	}

	get Level() {
		return this.level;
	}

	set Level(value) {
		if(value>10)
			this.level = 10;
		else if(value < 1)
			this.level = 1;
		else
			this.level = value;
	}
	
	drawGrid(context) {
		//let currTime = (new Date()).getMilliseconds();
		context.lineWidth = 2;
		context.strokeStyle = "rgb(100,100,100)";
		for (let x = 0; x < context.canvas.width; x += this.step) {
			context.moveTo(x, 0);
			context.lineTo(x, context.canvas.height);
		}
		for (let y = 0; y < context.canvas.height; y += this.step) {
		  context.moveTo(0, y);
		  context.lineTo(context.canvas.width, y);
		}

		context.stroke();
		//context.closePath();
		//console.log('drawGrid(): ' + ((new Date()).getMilliseconds() - currTime));
	}
	
	static DrawSquare(ctx, color, x, y, a) {
		//let currTime = (new Date()).getMilliseconds();
		ctx.fillStyle = color;
		ctx.fillRect(x * a, y * a, a, a);
		ctx.strokeStyle = 'rgb(100,100,100)';
		ctx.strokeRect(x * a, y * a, a, a);
		//console.log('drawSquare(): ' + ((new Date()).getMilliseconds() - currTime));
	}
	
	drawFigure(context, figure) {
		//let currTime = (new Date()).getMilliseconds();
		for(let y = 0; y<figure.arr.length; y++)
		{
			for(let x = 0; x<figure.arr[0].length; x++)
			{
				if(figure.arr[y][x])
					Field.DrawSquare(context, figure.color, figure.x + x, figure.y + y, this.step);
			}
		}
		//console.log('drawFigure(): ' + ((new Date()).getMilliseconds() - currTime));
	}
	
	drawNext(context, next) {
		let nextX = typeFigures[next][0].length;
		let nextY = typeFigures[next].length;
		let a = Math.floor((5 - nextX)/2);
		let b = Math.floor((5 - nextY)/2);
		for(let y = 0; y<nextY; y++)
		{
			for(let x = 0; x<nextX; x++)
			{
				if(typeFigures[next][y][x])
					Field.DrawSquare(context, color[next], x + a, y + b, this.step);
			}
		}
	}
	
	drawField(context) {
		//let currTime = (new Date()).getMilliseconds();
		for(let y = 0; y<this.y; y++)
		{
			for(let x = 0; x<this.x; x++)
			{
				if(this.boolField[y][x])
					Field.DrawSquare(context, this.colorField[y][x], x, y, this.step);
			}
		}
		//console.log('drawField(): ' + ((new Date()).getMilliseconds() - currTime));
	}
	clearRect(context, startX, startY, width)
	{
		context.fillStyle = "rgb(0,0,0)";
		//console.log(startX + ' ' + startY+' '+width);
		//context.clearRect(startX, startY, width, width);
		context.fillRect(startX * this.step, startY * this.step, width * this.step, width * this.step);
		//
		this.redrawGridRect(context, startX * this.step, startY * this.step, width * this.step);
		let lenY = this.boolField.length;
		let lenX = this.boolField[0].length;
		for(let y = startY; y<width + startY; y++)
		{
			for(let x = startX; x<width + startX; x++)
			{
				if(y < lenY && x < lenX && x >= 0 && y >= 0 && this.boolField[y][x])
					Field.DrawSquare(context, this.colorField[y][x], x, y, this.step);
			}
		}


	}
	redrawGridRect(context, startX, startY, width)
	{
		//console.log(width);
		context.lineWidth = 2;
		context.strokeStyle = "rgb(100,100,100)";
		for (let x = startX; x < width; x += this.step) {
			//console.log(x);
			context.moveTo(x, startY);
			context.lineTo(x, width);
		}
		for (let y = startY; y < width; y += this.step) {
			//console.log(y);
		  context.moveTo(startX, y);
		  context.lineTo(width, y);
		}
		
		context.stroke();
	}
	clearAll(context) {
		let currTime = (new Date()).getMilliseconds();
		context.fillStyle = "rgb(0,0,0)";
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		context.fillRect(0, 0, context.canvas.width, context.canvas.height);
		this.drawGrid(context);
		//console.log('clearAll(): ' + ((new Date()).getMilliseconds() - currTime));
	}
	
	NewFigure(typeFigures, color) {
		let indexThis = this.indexNext;
		this.indexNext = Math.floor(Math.random() * color.length);
		this.clearAll(this.nextContext);
		this.drawNext(this.nextContext,this.indexNext);
		let newFigure = Figure.Factory(typeFigures, color, indexThis);
		let field = this;
		field.fl = true;
		let x, y;
		//newFigure.x = 1;
		while(!field.check(newFigure))
		{
			newFigure.x = Figure.StartX();
		}

		document.onkeydown = function(event)
		{
			if(!newFigure.falled && !field.stop)
			{
				x = field.newFigure.x;
				y = field.newFigure.y;
				event.preventDefault();
				switch(event.key)
				{
					case 'ArrowRight':
						newFigure.x++;
						if(!field.check(newFigure))
							newFigure.x--;
					break;
					case 'ArrowLeft':
						newFigure.x--;
						if(!field.check(newFigure))
							newFigure.x++;
					break;
					case 'ArrowDown':
						if(field.fl && !field.falled)
						{
							clearInterval(field.timerId);
							field.timerId = setInterval(field.ticker.bind(field), 20);
							field.fl = false;
						}
					break;
				}
				field.clearRect(field.context,x, y, field.newFigure.width);
				field.drawFigure(field.context, field.newFigure);
				//field.drawField(field.context);
			}

		}

		document.onkeyup = function(event)
		{
			if(!newFigure.falled)
			{
				x = field.newFigure.x;
				y = field.newFigure.y;
				switch(event.key)
				{
					case 'ArrowUp':
						if(!field.stop)
						{
							newFigure.Rotate(false);
							if(!field.check(newFigure))
								newFigure.Rotate(true);
							field.clearRect(field.context,x, y, field.newFigure.width);
							field.drawFigure(field.context, field.newFigure);
							//field.drawField(field.context);
						}
					break;
					case ' ':
						if(!field.stop)
						{
							field.stopGame();
						}
						else
						{
							field.stop = false;
							field.timerId = setInterval(field.ticker.bind(field), field.Tick);
							field.clearAll(field.context);
							field.drawFigure(field.context, field.newFigure);
							field.drawField(field.context);
							field.clearAll(field.nextContext);
							field.drawNext(field.nextContext,field.indexNext);
						}
					break;
				}
			}

		}
		this.newFigure = newFigure;
		//field.clearAll(field.context);
		field.drawFigure(field.context, field.newFigure);
		//field.drawField(field.context);
	}
	
	startGame(context) {
		//this.fl = true;
		this.stop = false;
		this.timerId = setInterval(this.ticker.bind(this), this.Tick);
		this.clearAll(this.context);
		this.drawFigure(this.context, this.newFigure);
		this.drawField(this.context);
	}
	
	ticker() {
		//let currTime = (new Date()).getMilliseconds();
		if(this.newFigure.falled)
		{
			if(!this.fl)
			{
				clearInterval(this.timerId);
				
				this.timerId = setInterval(this.ticker.bind(this), this.Tick);
			}
			
			this.addFigure(this.newFigure);
			if(!this.gameOver)
				this.NewFigure(typeFigures, color);
		}
		else
		{
			let y = this.newFigure.y;
			this.newFigure.y++;
			if(!this.check(this.newFigure))
			{
				this.newFigure.falled = true;
				this.newFigure.y--;
			}
			if(!this.newFigure.falled)
			{
				this.clearRect(this.context,this.newFigure.x, y, this.newFigure.width);
				this.drawFigure(this.context, this.newFigure);
			}
			
			//this.clearAll(this.context);
			
			//this.drawField(this.context);
		}
		//console.log('ticker(): ' + ((new Date()).getMilliseconds() - currTime));
	}
	
	stopGame()
	{
		clearInterval(this.timerId);
		this.stop = true;
		this.context.fillStyle = "rgba(100,100,100,0.5)";
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.nextContext.fillStyle = "rgba(100,100,100,0.5)";
		this.nextContext.fillRect(0, 0, this.nextContext.canvas.width, this.nextContext.canvas.height);
		let text;
		this.context.font = 'bold 50px sans-serif';
		this.context.fillStyle = "rgb(255,255,255)";
		this.context.strokeStyle = "rgb(0,0,0)";
		if(this.gameOver)
		{
			text = 'игра окончена';
			this.context.fillText(text, 75, 400);
		}
		else
		{
			text = 'игра остановлена';
			this.context.fillText(text, 30, 400);
		}	
	}
	addFigure(figure)
	{

		for(let y = 0; y<figure.height; y++)
		{
			for(let x = 0; x<figure.width; x++)
			{
				if(figure.arr[y][x])
				{
					this.boolField[y + figure.y][x + figure.x] = true;
					this.colorField[y + figure.y][x + figure.x] = figure.color;
				}
			}
		}
		this.checkLines();
		if(this.boolField[0].some(function(el){return el;}))
		{
			this.gameOver = true;
			console.log("I'm here!");
			this.stopGame();
		}
	}
	addLVL()
	{
		//console.log(this.Level);
		if(this.cnt > this.Level+1)
		{
			this.score+=this.cnt;
			this.Level++;
			this.cnt = 0;
			//console.log(this.Level);
			this.Tick /= this.tickStep;
			clearInterval(this.timerId);
			this.timerId = setInterval(this.ticker.bind(this), this.Tick);
		}
	}
	checkLines()
	{
		let arrBool = [[]];
		arrBool = this.boolField.filter(function(elem)
		{
			return elem.some(function(value)
			{
				return value == false;
			});
		});
		if(arrBool.length < 16)
		{
			let arrColor = [[]];
			arrColor = this.colorField.filter(function(elem)
			{
				return elem.some(function(value)
				{
					return value == 'rgb(0,0,0)';
				});
			});
			let matrix1 = [...Array(this.y - arrBool.length)].map(function(){
			return [...Array(10)].map(function(){return false});
			});
			let matrix2 = [...Array(this.y - arrColor.length)].map(function(){
			return [...Array(10)].map(function(){return 'rgb(0,0,0)'});
			});
			this.boolField = matrix1.concat(arrBool);
			this.colorField = matrix2.concat(arrColor);
			this.cnt += matrix1.length;
			this.addLVL();
			this.clearAll(this.context);
			this.drawField(this.context);
			//this.drawFigure(this.context, this.newFigure);
		}
		
	}
	check(figure)
	{
		let currTime = (new Date()).getMilliseconds();
		for(let y = 0; y<figure.height; y++)
		{
			for(let x = 0; x<figure.width; x++)
			{
				if(figure.arr[y][x])
				{
					if((figure.x + x) >= this.x || (figure.y + y) >= this.y|| (figure.x + x) < 0 || (figure.y + y) < 0)
					{
						return false;
					}else if(this.boolField[figure.y + y][figure.x + x])
					{
						return false;
					}
				}
			}
		}
		//console.log('check(): ' + ((new Date()).getMilliseconds() - currTime));
		return true;
	}
	
	saveField() {
		this.stopGame();
		let exportData = {
			'boolField' : this.boolField,
			'colorField' : this.colorField,
			'cnt' : this.cnt,
			'level' : this.level,
			'indexNext' : this.indexNext,
			'newFigure' : this.newFigure,
		};
		return JSON.stringify(exportData);
	}
	
	static loadField(json, canvas, next) {
		let field = new Field(canvas, next);
		
		if (json == '' && json == null) return field;
		
		try {
			let exportData = JSON.parse(json);
			field.boolField = exportData.boolField;
			field.colorField = exportData.colorField;
			field.cnt = exportData.cnt;
			field.level = exportData.level;
			field.indexNext = exportData.indexNext;
			field.newFigure.arr = exportData.newFigure.arr;
			field.newFigure.x = exportData.newFigure.x;
			field.newFigure.y = exportData.newFigure.y;
			field.newFigure.color = exportData.newFigure.color;
			field.newFigure.falled = exportData.newFigure.falled;
		}
		catch {
			// Muted
		}
		
		return field;
	}
};

class Figure
{
	constructor(arr,color,x)
	{
		//console.log(arr);
		this.arr = arr;
		this.falled = false;
		this.height = arr.length;
		this.width = arr[0].length;
		Figure.StartRotate(this, Math.floor(Math.random() * 4));
		this.color = color;
		this.x = x;
		for(let y = 0; y<this.arr.length;y++)
		{
			if(this.arr[y].some(function(elem){return elem;}))
			{
				this.y = -y;
				break;
			}
		}
	}
	static Factory(figureList, colorList, index)
	{
		return new Figure(figureList[index],colorList[index],Figure.StartX());
	}
	static StartRotate(figure,rotate)
	{
		let rnd = Math.floor(Math.random() * 11);
		if(rotate > 0)
		{
			if(rotate == 3)
			figure.Rotate(true);
			else
			for(let i = 0; i<rotate; i++)
				figure.Rotate(false);
		}
	}
	static StartX()
	{
		return Math.floor(Math.random() * 11);
	}
	Rotate(left)
	{
		let arr = this.arr.slice();
		let tmp = [];
		let str = '';
		for(let i=0;i<this.height;i++)
		{
			tmp[i] = [];
			for(let j=0;j<this.width;j++)
			{
				if(left)
				tmp[i][j]=arr[j][this.height - i - 1];
				else
				tmp[i][j]=arr[this.width - j - 1][i];

			}
		}
		this.arr = tmp.slice();
	}
}
let typeFigures = [
[
[1,1],
[1,1]
],[
[0,1,1],
[0,1,0],
[0,1,0]
],[
[1,1,0],
[0,1,0],
[0,1,0]
],[
[0,0,0],
[1,1,0],
[0,1,1]
],[
[0,0,0],
[0,1,0],
[1,1,1]
]
,[
[0,0,0],
[0,1,1],
[1,1,0]
]
,[
[0,0,1,0,0],
[0,0,1,0,0],
[0,0,1,0,0],
[0,0,1,0,0],
[0,0,0,0,0]
]
];
let color = ['rgb(0,255,0)', 'rgb(255,0,0)', 'rgb(100,0,100)', 'rgb(255,100,0)', 'rgb(0,0,255)', 'rgb(0,100,100)', 'rgb(150,46,88)'];
let canvas = document.getElementById('canvas');
let next = document.getElementById('next');

if (!canvas.getContext) {
	throw '';
}
let fl = new Field(canvas,next);
fl.startGame();