import { engine } from "../../init.js";

(function(){
	engine.add.style(["shortcode/shortcode"]);
	var shortcode=function(){
		engine.model.tool.call(this);
		this.type="div";
		this.module="shortcode";
		this.text="";
		this.canDrag=true;
		this.editable=false;
		this.class=["shortcode"];
		this.value=0;
	}

	$(window).on("engine-edit",function(){
		var target=engine.target;
		if(target.module=="shortcode"){
			var select=engine.add.tab("properties").tag({
				tag:"select",
			});
			var l=Object.keys(pages);
			for(var i=0;i<l.length;i++){
				select.addOption(pages[l[i]].title,l[i]);
			};
			select.value=target.value;

			$(select).on("change",function(){
				target.value=this.value;
				target.text='[pages '+this.value+' content]';
				engine.clear();
			})
		}
	})

	$(window).on("engine-clear",function(){
		var l=$(".allsenses-editor .content .shortcode");
		for(var i=0;i<l.length;i++){
			var html=$(".allsenses-editor .content .shortcode")[i].innerHTML;
			if(html!=""){
				var short=html.replace("[","").replace("]","").split(" ");
				var id=short[1];
				var param=short[2];
				if(pages[id]){
					$(".allsenses-editor .content .shortcode")[i].innerHTML=pages[id][param];
				}
			}
		}
		
	});

	engine.add.tab("tools").tool("Extra","fal fa-brackets","Shortcode",shortcode);
})();