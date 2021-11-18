(function(){
	var json=JSON.stringify(engine.get.JSON());
	var history={
		data:[json],
		now:0,
	}

	var save=function(){
		var json=JSON.stringify(engine.get.JSON());
		history.data.splice(history.now+1,history.data.length);
		if(history.data[history.now]!=json){
			history.data.push(json);
			history.now++;
		}
		engine.parents();
	}

	$(window).on("engine-add",save);
	$(".allsenses-editor .panel").on("click",save);
	$(".allsenses-editor .container").on("click",save);

	window.addEventListener("keydown",function(event){
		var target=document.activeElement.getAttribute("contenteditable");
		if(target=="true" || document.activeElement.localName=="input"){
			return false;
		}
			if(event.code=="KeyZ" && event.ctrlKey){
				event.preventDefault();
				history.now--;
				if(history.now<0){
					history.now=0;
				}else{
					engine.notification("fal fa-undo","Undo");
					engine.data=JSON.parse(history.data[history.now]);
					engine.clear();
					engine.remove.tab("properties").content();
					engine.tools.show();
					engine.edit.hide();
				}
			}
			if(event.code=="KeyY" && event.ctrlKey){
				event.preventDefault();
				history.now++;
				if(history.now>=history.data.length-1){
					history.now=history.data.length-1;
				}else{
					engine.notification("fal fa-redo","Redo");
					engine.data=JSON.parse(history.data[history.now]);
					engine.clear();
					engine.remove.tab("properties").content();
					engine.tools.show();
					engine.edit.hide();
				}
			}
	});
	engine.clear();
})();