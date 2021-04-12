(function(){
	var h3=function(){
		engine.model.tool.call(this);
		this.type="h3";
		this.class="text-left";
		this.placeholder="Sample text...";
		this.draggable=true;
	}
	var tool=function(){
		engine.add.object(new h3());
	}



	engine.tools.add("fal fa-h3","H3",tool);
})()