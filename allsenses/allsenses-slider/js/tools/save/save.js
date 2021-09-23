import { engine } from "../../init.js";


(function(){
	engine.plugin.save=function(){
		localStorage.setItem("engine",JSON.stringify(engine.data));
		engine.notification("fal fa-save","Saved");
	}

	var data=localStorage.getItem("engine");
	if(data){
		engine.data=JSON.parse(data);
		engine.clear();
		engine.notification("fal fa-save","Loaded");
	}

	engine.add.bar("fas fa-share-square green",engine.plugin.save);
})();