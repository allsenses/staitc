import { engine } from "../../init.js";

(function(){
	$(window).on("engine-edit",edit)


	function edit(){
		var target=engine.target;
		if(target.module=="image"){
			engine.remove.tab("properties").content();
			engine.add.tab("properties").input("Image:","text",target.src,function(){
				target.src=this.value;
				engine.element.src=this.value;
			});
			engine.plugin.gallery.create("properties",{
				files:[target.src],
				callback:function(source){
					if(source){
						target.src="/th/lg/"+source;
						engine.element.src="/th/lg/"+source;
					}
					edit();
				},
				remove:function(id){
					target.src="/thumbs/noimage.png";
					engine.element.src="/thumbs/noimage.png";
				}
			});
			engine.plugin.gallery.size("properties",{
				files:[target.src],
				callback(sources){
					target.src=sources[0];
					engine.element.src=sources[0];
				}
			})
		}
	}
})();