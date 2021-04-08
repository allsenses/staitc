(function(){
	var h2=function(){
		engine.model.tool.call(this);
		this.type="h2";
		this.class="text-left";
		this.placeholder="Sample text...";
	}
	var tool=function(){
		engine.add.object(new h2());
	}



	engine.tools.add("fal fa-h2","H2",tool);
})()