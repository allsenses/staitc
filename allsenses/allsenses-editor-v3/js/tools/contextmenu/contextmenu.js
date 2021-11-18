(function(){
	engine.add.style(["contextmenu/contextmenu"]);
	$(".allsenses-editor").on("click",function(){
		engine.plugin.contextmenu.hide();
	})

	var menu=document.createElement("div");
	menu.className="contextmenu";
	$(".allsenses-editor").append(menu);

	engine.plugin.contextmenu={
		create:function(event,options){
			var x=event.clientX;
			var y=event.clientY;
			$(menu).attr("style","left:"+x+"px;top:"+y+"px");
			menu.innerHTML="";
			options.forEach(function(e){
				e.icon=e.icon || "";
				e.text=e.text || "";
				e.click=e.click || null;
				e.class=e.class || "";
				e.text=lang.translate(e.text);

				var a=document.createElement("a");
				a.className=e.class;
				$(a).html('<i class="'+e.icon+'"></i><span>'+e.text+'</span>');
				$(a).on("click",engine.plugin.contextmenu.hide)
				$(a).on("click",e.click);
				menu.appendChild(a);
			});
			engine.plugin.contextmenu.show();
		},
		hide:function(){
			$(menu).removeClass("active");
		},
		show:function(){
			$(menu).addClass("active");
		}
	}
})();