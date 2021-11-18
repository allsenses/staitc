(function(){
	$(".allsenses-editor .panel").on("contextmenu",function(event){
		engine.plugin.contextmenu.create(event,[
			{icon:"fal fa-file",text:"Copy template",click:template.copy},
		]);
		event.preventDefault();
	});

	window.addEventListener("paste",function(event){
		if(engine.edit.target==null && document.activeElement.contentEditable=="inherit"){
			template.paste(event.clipboardData.getData("text/plain"));
		}
	})

	var template={
		copy:function(){
			var textarea=document.createElement("textarea");
			textarea.value=JSON.stringify(engine.get.JSON());
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand("copy");
			document.body.removeChild(textarea);
		},
		paste:function(data){
			try{
				data=JSON.parse(data);
				data.forEach(function(e){
					engine.data.push(e);
				});
				engine.clear();
			}catch(err){}
		}
	} 
})();