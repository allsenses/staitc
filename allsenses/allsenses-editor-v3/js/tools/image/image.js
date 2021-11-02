import { engine } from "../../init.js";

(function(){
	engine.add.style(["image/image"]);
	var picture=function(){
		engine.model.tool.call(this);
		engine.plugin.spacing.model.call(this);
		this.type="picture";
		this.module="picture";
		this.editable=false;
		this.container=false;
		this.canDrag=true;
		this.canFocus=true;
		this.content=[
			new source(),
			new source(),
			new image()
		]
	}

	var image=function(src,alt){
		engine.model.tool.call(this);
		engine.plugin.spacing.model.call(this);
		this.type="img";
		this.module="image";
		this.editable=false;
		this.container=false;
		this.canFocus=false;
		this.src=src || "js/tools/image/noimage.jpg";
		this.alt=alt || "";
		this.attr={
			"lazy":""
		}
	}

	var source=function(src,type){
		engine.model.tool.call(this);
		engine.plugin.spacing.model.call(this);
		this.type="source";
		this.module="source";
		this.editable=false;
		this.container=false;
		this.canFocus=false;
		this.attr={
			"srcset":src || "js/tools/image/noimage.jpg",
			"type":type || ""
		}
	}

	
	var edit=function(){
		var target=engine.target;
		if(target.module=="picture"){

			engine.plugin.gallery.create({
				files:[target.content[2].src],
				callback:function(src){
					if(src){
						var alt=target.content[2].alt;
						target.content=[];
						target.content.push(
							new source("/th/lg/"+src,"image/webp")
						)
						target.content.push(
							new source("/th/lg/"+src+"/jpg","image/jpeg")
						)
						target.content.push(
							new image("/th/lg/"+src+"/jpg",alt)
						)
					}
					engine.clear();
					edit();
				}
			});

			engine.plugin.gallery.size({
				files:[target.content[2].src],
				callback:function(sources){
					var alt=target.content[2].alt;
					target.content=[];
					target.content.push(
						new source(sources[0],"image/webp")
					)
					target.content.push(
						new source(sources[0]+"/jpg","image/jpeg")
					)
					target.content.push(
						new image(sources[0]+"/jpg",alt)
					)
					engine.clear();
				}
			});

			var input=engine.properties.add({
				tag:"input",
				placeholder:"Alt text...",
				value: target.content[2].alt,
			});
			$(input).on("change",function(){
				target.content[2].alt=this.value;
				engine.clear();
			})
			engine.plugin.spacing.create(target,edit);
			engine.plugin.class.create(target,edit);
		}
	}

	
	$(window).on("engine-edit",edit);
	engine.add.tab("tools").tool("Basic","fal fa-image","Image",picture);
})()