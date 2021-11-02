import { engine } from "../init.js";
export const view={
	slides:function(){
		let target=engine.data[engine.slide];
		engine.remove.tab("slides").content();

		if(engine.data[engine.slide]){
			var input=engine.add.tab("slides").input("Slide title:","text",engine.data[engine.slide].name);
			$(input).on("input",function(){
				engine.data[engine.slide].name=this.value;
			});
	
			var input=engine.add.tab("slides").input("Background:","text",engine.data[engine.slide].background);
			$(input).on("change",function(){
				engine.data[engine.slide].background=this.value;
				engine.clear();
			});

			
			engine.plugin.gallery.create("slides",{
				files:[target.background],
				callback:function(source){
					if(source){
						target.background="/th/lg/"+source;
					}
					view.slides();
					engine.clear();
				},
				remove:function(id){
					target.background="/thumbs/noimage.png";
				}
			});
			engine.plugin.gallery.size("slides",{
				files:[target.background],
				callback(sources){
					target.background=sources[0];
					engine.clear();
				}
			});
		};
		

		engine.add.tab("slides").button("Add slide",function(){
			engine.data.push({
				type:"slide",
				name:"Slide#"+engine.data.length,
				background:"",
				content:[]
			});
			view.slides();
		});
		let i=0;
		engine.data.forEach(function(e){
			let j=i;
			engine.add.tab("slides").slide(e.name,function(){
				engine.slide=j;
				engine.clear();
				view.slides();
			},function(){
				engine.data.splice(j,1);
				view.slides();
				if(j==engine.slide) engine.clear();
			})
			i++;
		})
	},

	settings:function(){
		engine.remove.tab("settings").content();
		let add=engine.add.tab("settings");
		var checkbox=add.checkbox("Loop:",function(){
			engine.settings.loop=this.checked;
		});
		checkbox.checked=engine.settings.loop;

		var checkbox=add.checkbox("Autoplay:",function(){
			engine.settings.autoplay=this.checked;
		});
		checkbox.checked=engine.settings.autoplay;

		var select=add.select("Animation:",function(){
			engine.settings.animateOut=this.value;
		});
		select.addOption("Fade","fadeOut");
		select.addOption("Slide","");
		select.value=engine.settings.animateOut;

		var input=add.input("Animation speed:","number",engine.settings.autoplayTimeout);
		$(input).on("change",function(){
			engine.settings.autoplayTimeout=Number(this.value);
		});

	}
}