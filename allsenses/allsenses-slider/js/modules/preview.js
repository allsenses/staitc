import { engine } from "../init.js";


export function Laptop(){
	engine.preview();
	$(".allsenses-slider .content").attr("style","100%");	
}

export function Mobile(){
	engine.preview();
	$(".allsenses-slider .content").attr("style","width:320px");
}