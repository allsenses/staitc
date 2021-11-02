import { engine } from "../init.js";


export function Laptop(){
	$(".engine .content iframe").attr("style","");	
}

export function Tablet(){
	$(".engine .content iframe").attr("style","width:768px");
}

export function Mobile(){
	$(".engine .content iframe").attr("style","width:375px");
}