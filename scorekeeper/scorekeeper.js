var b1=document.querySelector("#p1")
var b2=document.getElementById("p2");
var b3=document.getElementById("res");
var p1s=0;
var p2s=0;
var p1=document.getElementById("p1s");
var p2=document.getElementById("p2s");
var playing=7;
var gameOver=false;
var input=document.getElementById("input");
var playingTo=document.getElementById("count");
b1.addEventListener("click",function(){
	if(!gameOver){
		p1s++;
		p1.textContent=p1s;
		if(p1s===playing)
		{
			p1.classList.add("green");
			gameOver=true;
		}
	}
});
b2.addEventListener("click",function(){
	if(!gameOver){
		p2s++;
		p2.textContent=p2s;
		if(p2s===playing)
		{
			p2.classList.add("green");
			gameOver=true;
		}
	}
});
b3.addEventListener("click",function(){
	p1s=0;
	p2s=0;
	p1.textContent=0;
	p2.textContent=0;
	p1.classList.remove("green");
	p2.classList.remove("green");
	gameOver=false;
});
input.addEventListener("change",function(){
	playingTo.textContent=Number(input.value);
	playing=Number(input.value);
});