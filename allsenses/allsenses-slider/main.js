var tools=["gallery","save","image","templates"];
console.log(controller);
import {engine} from "./js/init.js";
engine.directory="/templates/admin/scripts/allsenses-slider/";
$(window).on("load",function(){
	engine.init(document.body,tools);
});