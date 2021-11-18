import { engine } from "../../init.js";

(function(){
	var heading=function(){
		engine.model.tool.call(this);
		engine.plugin.spacing.model.call(this);
		this.module="heading"
		this.type="h1";
		this.placeholder="Sample text...";
		this.canDrag=true;
	}

	
	var edit=function(){
		var target=engine.target;
		if(target.module=="heading"){
			engine.remove.tab("properties").content();
			var label=engine.add.tab("properties").tag({
				tag:"label",
				class:"spacing-label",
				html:"Heading:"
			});
			
			var select=engine.model.tag({
				tag:"select",
			});
			for(var i=1;i<=6;i++){
				select.addOption("h"+i,"h"+i);
			};
			select.value=target.type;
			
			$(select).on("change",function(){
				target.type=this.value;
				engine.clear();
			});
			label.appendChild(select)

			engine.plugin.spacing.create(target,edit);
			engine.plugin.aos.create(target,edit);
			engine.plugin.class.create(target,edit);
		}
	}



	$(window).on("engine-edit",edit);


	engine.add.tab("tools").tool("Basic","fal fa-heading","Heading",heading);
})()