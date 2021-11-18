import { engine } from "../../init.js";

(function(){
	engine.add.iframe.style("js/tools/line/line.css");
	var line=function(){
		engine.model.tool.call(this);
		this.module="line";
		this.type="hr";
		this.editable=false;
		this.container=false;
		this.canRemove=true;
		this.canDrag=true
	}



	engine.add.tab("tools").tool("Basic","fal fa-horizontal-rule","Line",line);
})()