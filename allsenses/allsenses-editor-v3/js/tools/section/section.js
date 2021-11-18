import { engine } from "../../init.js";

(function(){
	var container=function(){
		engine.model.tool.call(this);
		this.module="container";
		this.type="div";
		this.class=["grid-container"];
		this.editable=false;
		this.container=true;
		this.canRemove=false;
		this.canDrag=false;
		this.canFocus=false;
		this.lockClass.push("grid-container");
	}
	
	var section=function(){
		engine.model.tool.call(this);
		this.type="section";
		this.module="section";
		this.content=[
			new container()
		];
		this.editable=false;
		this.container=false;
		this.canDrag=true;
		this.canRemove=true;
		this.background="";
		this.fluid=false;
	}

	
	var edit=function(){
		var target=engine.target;
		if(target.module=="section"){
			engine.remove.tab("properties").content();
			engine.plugin.gallery.create({
				files:[target.background],
				remove:function(id){
					target.background="";
					target.style='background-image:url('+target.background+');';
					engine.clear();
				},
				callback:function(source){
					if(source){
						target.background="/th/lg/"+source;
						target.style='background-image:url('+target.background+');';
					}
					engine.clear();
					edit();
				}
			});

			engine.plugin.gallery.size({
				files:[target.background],
				callback:function(sources){
					target.background=sources[0];
					target.style='background-image:url('+target.background+');';
					engine.clear();
				}
			});
			
			var input=engine.add.tab("properties").tag({
				tag:"checkbox",
				html:"Fluid:",
				checked:target.fluid
			});
			$(input.querySelector("input")).on("click",function(){
				if(this.checked){
					target.content[0].class=["grid-container","fluid"];
					target.fluid=true;
				}else{
					target.content[0].class=["grid-container"];
					target.fluid=false;
				}
				engine.clear();
			});

			engine.plugin.class.create(target,edit);
		}
	}
	
	$(window).on("engine-edit",edit);

	engine.add.tab("tools").tool("Basic","fal fa-square","Section",section);
})()