import { engine } from "../../init.js";

(function(){

	var container=function(){
		engine.model.tool.call(this);
		engine.plugin.spacing.model.call(this);
		this.module="container";
		this.type="div";
		this.canDrag=true;
		this.editable=false;
		this.container=true;
	}



	function edit(){
		var target=engine.target;
		if(target.module=="container"){
			engine.properties.clear();
			engine.plugin.spacing.create(target,edit);
			engine.plugin.aos.create(target,edit);
			engine.plugin.tooltip.create(target,edit);
			engine.plugin.class.create(target,edit);
		}
	}


	$(window).on("engine-edit",edit);

	engine.add.tab("tools").tool("Basic","fal fa-draw-square","Container",container);
})();
