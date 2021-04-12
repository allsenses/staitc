(function(){
	var icons=[];
	$.getJSON(require.baseURL+"icons.json",function(data){
		icons=data["icon"];
	})
	var icon=function(className){
		engine.model.tool.call(this);
		this.type="i";
		this.editable=false;
		this.class=className+" fa-5x";
		this.draggable=true;
	}
	var tool=function(){
		var section=document.createElement("section");
		var data="";
		icons.forEach(function(e){
			data+='<a data-icon="'+e+'"><i class="'+e+'"></i></a>';
		})
		section.innerHTML=data;
		$(section.querySelectorAll("a")).on("click",function(e){
			var data=this.getAttribute("data-icon");
			engine.add.object(new icon(data));
			engine.popup.hide();
			$(".allsenses-editor .popup").html("");
		})
		engine.popup.add(section,"center")
	}

	engine.tools.add("fab fa-font-awesome","Icon",tool);
})()