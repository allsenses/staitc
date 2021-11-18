import { engine } from "../../init.js";

(function(){
	var accordion=function(){
		engine.model.tool.call(this);
		this.module="accordion";
		this.type="ul";
		this.class="accordion";
		this.lockClass.push("accordion");
		this.editable=false;
		this.canDrag=true;
		this.content=[
			new accordionItem(),
			new accordionItem(true),
			new accordionItem()
		];
		this.data={
			"accordion":""
		};
	}

	var accordionItem=function(active){
		engine.model.tool.call(this);
		this.module="accordion-item";
		this.type="li";
		this.class="accordion-item";
		if(active) this.class="accordion-item is-active";
		this.lockClass.push("accordion-item");
		this.editable=false;
		this.content=[
			new accordionTitle(),	
			new accordionContent()
		];
		this.data={
			"accordion-item":""
		};
	}

	var accordionTitle=function(){
		engine.model.tool.call(this);
		this.module="accordion-title";
		this.type="a";
		this.class="accordion-title";
		this.lockClass.push("accordion-title");
		this.editable=false;
		this.canClone=false;
		this.canRemove=false;
		this.placeholder="Sample text";
		this.text="Accordion title";
	}

	var accordionContent=function(){
		engine.model.tool.call(this);
		this.module="accordion-content";
		this.type="div";
		this.class="accordion-content";
		this.lockClass.push("accordion-content");
		this.editable=false;
		this.container=true;
		this.canFocus=false;
		this.data={
			"tab-content":""
		};
	}



	var edit=function(){
		var target=engine.target;
		if(target.module=="accordion"){
			engine.remove.tab("properties").content();
			var div=engine.add.tab("properties").tag({
				tag:"div",
				class:"text-center"
			});
			var button=engine.model.tag({
				tag:"button",
				html:'<i class="fal fa-plus"></i> Add cell'
			});
			$(button).on("click",function(){
				target.content.push(new accordionItem());
				engine.clear();
			});
			div.appendChild(button);
			
			engine.plugin.class.create(target,edit);
		}
		var modules=["accordion-item","accordion-title"];
		if(modules.includes(target.module)){
			engine.remove.tab("properties").content();
			engine.plugin.class.create(target,edit);
		}
	}




	$(window).on("engine-clear",function(){
		engine.iframe.$("[data-accordion]").foundation();
	})

	$(window).on("engine-edit",edit);

	engine.add.tab("tools").tool("Extra","fas fa-layer-group","Accordion",accordion);
})();