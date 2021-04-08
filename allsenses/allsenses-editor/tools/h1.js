(function(){
	var h1=function(){
		engine.model.tool.call(this);
		this.type="h1";
		this.class="text-left";
		this.placeholder="Sample text...";
	}
	var tool=function(){
		engine.add.object(new h1());
	}



	engine.tools.add("fal fa-h1","H1",tool);
})()