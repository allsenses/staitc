(function(){
	var img=function(){
		engine.model.tool.call(this);
		this.type="img";
		this.module="img";
		this.alt=null;
		this.editable=false;
		this.draggable=true;
	}
	var tool=function(){
		var section=document.createElement("section");
		var input=document.createElement("input");
		input.type="text";
		input.placeholder="Alt do zdjęcia";
		input.setAttribute("style","display:block;width:100%");
		section.appendChild(input);
		$("#files-manager")[0].contentWindow.document.querySelectorAll("img").forEach(function(e){
			src=e.src.split(location.host)[1];
			section.innerHTML+='<div data-src="'+src+'" style="display:inline-block"><img src="'+e.src+'"></div>';
		});
		$(section.querySelectorAll("div")).on("click",function(event){
			var src=this.getAttribute("data-src").split("&")[0];
			var alt=section.querySelector("input").value;
			add(src,alt);
		})
		engine.popup.add(section,"center");
	}

	$(window).on("edit-init",function(event){
		var target=event.detail;
		if(target.module=="img"){
			var input=document.createElement("input");
			input.type="text";
			input.placeholder="Alt do zdjęcia";
			console.log("Test")
			$(input).on("change",function(){
				target.alt=this.value;
				engine.clear();
			})
			engine.popup.add(input,event);
		}
	})

	var add=function(src,alt){
		var obj=new img();
		obj.src=src;
		obj.alt=alt;
		engine.add.object(obj);
		engine.popup.hide();
	}

	engine.tools.add("fal fa-image","Image",tool);
})()