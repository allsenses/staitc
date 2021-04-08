(function(){
	var h4=function(){
		engine.model.tool.call(this);
		this.type="h4";
		this.class="text-left";
		this.placeholder="Sample text...";
	}
	var tool=function(){
		engine.add.object(new h4());
	}



	engine.tools.add("fal fa-h4","H4",tool);
})()