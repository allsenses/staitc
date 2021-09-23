import { engine } from "../init.js";


export function Laptop(){
	$(".allsenses-slider .content iframe").attr("style","");	
}

export function Tablet(){
	$(".allsenses-slider .content iframe").attr("style","width:768px");
}

export function Mobile(){
	$(".allsenses-slider .content iframe").attr("style","width:375px");
}