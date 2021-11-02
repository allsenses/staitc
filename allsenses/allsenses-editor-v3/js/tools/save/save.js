import { engine } from "../../init.js";


(function(){
	engine.plugin.save=function(callback){
		callback=callback || function(){};
		var json=JSON.stringify({
			data:engine.get.JSON(),
			settings:engine.settings
		});
		var data={
			id:id,
			json:json,
			content:engine.get.HTML()
		};
		engine.notification("fal fa-save","Saving page","",true);
		$.ajax({
			url:"/admin/pl/pl/"+controller+"/updateeditor",
			type:"post",
			data: data,
			complete:function(res){
				if(res.status==200 && res.readyState==4){
					if(res.responseText=="true"){
						engine.notification("fal fa-save","Slider saved","",false);
					}else{
						engine.notification("fal fa-save","You made no changes","",false);
					}
					callback();
				}
			}
		});
	}

	window.addEventListener("keydown",function(event){
		if(event.code=="KeyS" && event.ctrlKey){
			event.preventDefault();
			engine.plugin.save();
		}
	})

	if(content.json){
		engine.data=content.json.data;
		engine.settings=content.json.settings;
	}
	engine.clear();

	engine.add.bar("fas fa-share-square green",function(){
		engine.plugin.save();
	});
})();