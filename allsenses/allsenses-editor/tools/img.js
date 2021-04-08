(function(){
	var img=function(){
		engine.model.tool.call(this);
		this.type="img";
		this.editable=false;
	}
	var tool=function(){
		var section=document.createElement("section");
		$("#files-manager")[0].contentWindow.document.querySelectorAll("img").forEach(function(e){
			src=e.src.split(location.host)[1];
			section.innerHTML+='<div data-src="'+src+'" style="display:inline-block"><img src="'+e.src+'"></div>';
		});
		$(section.querySelectorAll("div")).on("click",function(event){
			var src=this.getAttribute("data-src").split("&")[0];
			add(src);
		})
		engine.popup.add(section,"center");
	}

	var add=function(src){
		var obj=new img();
		obj.src=src;
		engine.add.object(obj);
		engine.popup.hide();
	}

	engine.tools.add("fal fa-image","Image",tool);
})()