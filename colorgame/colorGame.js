var numSquares=6;
var colors=generateRandomColors(numSquares);
var squares=document.querySelectorAll(".square");
var colorDisplay=document.getElementById("colorDisplay");
var pickedColor=pickColor();
var messageDisplay=document.getElementById("message");
var h1=document.querySelector("h1");
var resetButton=document.querySelector("#reset");
var easybtn=document.querySelector("#easybtn");
var hardbtn=document.querySelector("#hardbtn");
colorDisplay.textContent=pickedColor;
for(var i=0;i<squares.length;i++)
{
	squares[i].style.background=colors[i];

	squares[i].addEventListener("click",function(){
		
		var clickedColor = this.style.background;
		if(clickedColor === pickedColor)
		{
			messageDisplay.textContent="correct!";
			resetButton.textContent="Play again?";
			h1.style.background=clickedColor;
			changeColors(clickedColor);
		}else{
			messageDisplay.textContent="try again";
			this.style.background="#232323";
		}
	});
}
function changeColors(color){
	for(var i=0;i<squares.length;i++){
		squares[i].style.background=color;
	}
}

function pickColor(){
	var rand=Math.floor((Math.random()*colors.length))
	return colors[rand];
}

function generateRandomColors(num)
{
	var ar=[];
	for(var i=0;i<num;i++)
	{
		ar.push(randomColor());
	}
	return ar;
}
function randomColor()
{
	var r=Math.floor(Math.random()*256);
	var g=Math.floor(Math.random()*256);
	var b=Math.floor(Math.random()*256);
	return "rgb(" +r+", "+g+", "+b+")";
}

resetButton.addEventListener("click",function(){
	colors=generateRandomColors(numSquares);
	pickedColor=pickColor();
	colorDisplay.textContent=pickedColor;
	for(var i=0;i<squares.length;i++){
		squares[i].style.background=colors[i];
	}
	h1.style.background="steelblue";
	messageDisplay.textContent="";
	this.textContent="new colors"
});

easybtn.addEventListener("click",function(){
	easybtn.classList.add("selected");
	hardbtn.classList.remove("selected");
	numSquares=3;
	colors=generateRandomColors(numSquares);
	pickedColor=pickColor();
	colorDisplay.textContent=pickedColor;
	for(var i=0;i<squares.length;i++){
		if(colors[i]){
			squares[i].style.background=colors[i];
		}
		else{
			squares[i].style.display="none";
		}
	}
});

hardbtn.addEventListener("click",function(){
	hardbtn.classList.add("selected")
	easybtn.classList.remove("selected");
	numSquares=6;
	colors=generateRandomColors(numSquares);
	pickedColor=pickColor();
	colorDisplay.textContent=pickedColor;
	for(var i=0;i<squares.length;i++)
	{
		squares[i].style.background=colors[i];
		squares[i].style.display="block";
		
	}
})