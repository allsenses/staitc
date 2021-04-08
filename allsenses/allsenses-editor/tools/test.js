(function(){
	var span=function(){
		engine.model.tool.call(this);
		this.type="span";
		this.class="text-left";
		this.placeholder="Sample text...";
	}
	var tool=function(){
		engine.add.object(new span());
	}

	$(window).on("edit-selection",function(event){
		
	});

	engine.tools.add("text","Test",tool);
})()