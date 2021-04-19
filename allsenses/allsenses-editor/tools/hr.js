(function(){
	var hr=function(){
		engine.model.tool.call(this);
		this.type="hr";
		this.alt=null;
		this.editable=false;
		this.container=false;
		this.draggable=true;
	}
	var tool=function(){
		engine.add.object(new hr())
	}

	engine.tools.add("fal fa-horizontal-rule","Line",tool);
})()