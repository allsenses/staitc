(function(){
	var h5=function(){
		engine.model.tool.call(this);
		this.type="h5";
		this.placeholder="Sample text...";
		this.draggable=true;
	}
	var tool=function(){
		engine.add.object(new h5());
	}



	engine.tools.add("fal fa-h5","H5",tool);
})()