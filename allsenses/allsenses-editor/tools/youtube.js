(function(){
	var youtube=function(src){
		engine.model.tool.call(this);
		this.type="iframe";
		this.src=src;
		this.placeholder="Sample text...";
		this.editable=false;
		this.container=false;
	}
	var tool=function(){
		var input=document.createElement("input");
		input.type="text";
		input.placeholder="Adres filmu youtube";
		engine.popup.add(input,"center",function(){
			engine.add.object(new youtube(input.value));
		});
	}



	engine.tools.add("fab fa-youtube","YT",tool);
})();