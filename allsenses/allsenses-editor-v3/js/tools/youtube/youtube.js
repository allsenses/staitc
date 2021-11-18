import { engine } from "../../init.js";

(function(){
	engine.add.style(["youtube/youtube"]);
	var youtube=function(){
		engine.model.tool.call(this);
		this.type="iframe";
		this.src="https://www.youtube.com/embed/h3fUgOKFMNU";
		this.module="youtube";
		this.editable=false;
		this.canDrag=true;
	}

	$(window).on("engine-edit",function(){
		var target=engine.target;
		if(target.module=="youtube"){
			var input=engine.add.tab("properties").tag({
				tag:"input",
				type:"text",
				placeholder:"https://www.youtube.com/watch?v=h3fUgOKFMNU",
				value:target.src
			});
			$(input).on("change",function(){
				var url=this.value.split("v=")[1].split("&")[0];
				target.src="https://www.youtube.com/embed/"+url;
				engine.clear();
			})
		}
	})

	var options=function(target){
		var form=engine.add.popup("Youtube video address");
		var input=document.createElement("input");
		input.type="text";
		input.placeholder="https://www.youtube.com/watch?v=h3fUgOKFMNU"
		var input=form.tag(input);
		$(form).on("submit",function(){
			var url=input.value.split("v=")[1].split("&")[0];
			target.src="https://www.youtube.com/embed/"+url;
			engine.clear();
		});
	}

	engine.add.tab("tools").tool("Extra","fab fa-youtube","YouTube",youtube,options);
})();