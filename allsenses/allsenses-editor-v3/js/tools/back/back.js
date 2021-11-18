(function(){
	window.location.hash="#allsenses-editor";

	// Stupid chrome need this vvvvv to save doc after clicking history back
	$(".allsenses-editor").on("click",function(){
		window.location.hash="#allsenses-editor";
	})
	engine.add.device({
		icon:"fal fa-arrow-left",
	},function(){
		window.removeEventListener("beforeunload",engine.unload);
		$(".allsenses-editor .load").addClass("active");
		engine.saveData(function(){
			setTimeout(function(){
				document.location.href="/admin/pl/pl/"+engine.controller+"/edit/id/"+engine.id;
			},500)
		});
	});

	window.addEventListener("hashchange",function(){
		if(window.location.hash!="#allsenses-editor"){
			window.removeEventListener("beforeunload",engine.unload);
			$(".allsenses-editor .load").addClass("active");
			engine.saveData(function(){
				setTimeout(function(){
					history.back();
				},500)
			});
		}
	})
})();