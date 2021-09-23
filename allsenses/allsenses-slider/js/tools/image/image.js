import { engine } from "../../init.js";

(function(){
	$(window).on("engine-edit",function(){
		var target=engine.target;
		if(target.module=="image"){
			engine.remove.tab("properties").content();
			engine.add.tab("properties").input("Image:","text",target.src,function(){
				engine.target.src=this.value;
				engine.element.src=this.value;
			});
		}
	})
})();