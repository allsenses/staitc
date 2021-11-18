import { engine } from "../../init.js";

(function(){
	engine.add.style(["icons/icons.css"]);
	var icon=[];
	$.getJSON("js/tools/icons/icons.json",function(data){
		icon=data["icon"];
	});
	var icons=function(className){
		engine.model.tool.call(this);
		this.module="icons";
		this.type="i";
		this.editable=false;
		this.icon="fal fa-envelope";
		this.size="fa-5x";
		this.class=["fal","fa-envelope","fa-5x"];
		this.canDrag=true;
	}

	$(window).on("engine-edit",function(){
		var target=engine.target;
		if(target.module=="icons"){
			var select=engine.add.tab("properties").tag({
				tag:"select",
			});
			for(var i=1;i<=5;i++){
				select.addOption("Size "+i,"fa-"+i+"x");
			};
			select.value=target.size;

			$(select).on("change",function(){
				target.size=this.value;
				target.class=[target.icon,target.size];
				engine.clear();
			})
		}
	})

	var options=function(target){
		var form=engine.add.popup("Icon selection");

		var input=form.tag({
			tag:"input",
			type:"text",
			placeholder:"Icon name..."
		});

		$(input).on("keyup",function(event){
			$(".engine .popup [data-icon]").hide();
			var val=this.value;
			$(".engine .popup [data-icon]").each(function(){
				if(this.getAttribute("data-icon").search(val)!=-1){
					$(this).show();
				}
			});
			return false;
		});

		var html="";
		icon.forEach(function(e){
			html+='<a data-icon="'+e+'"><i class="'+e+'"></i></a>';
		})
		var div=form.tag({
			tag:"div",
			class:"icons"
		});
		div.innerHTML=html;
		$(div.querySelectorAll("a")).on("click",function(event){
			target.icon=$(this).attr("data-icon");
			target.class=[target.icon,target.size];
			engine.clear();
		})
	}

	engine.add.tab("tools").tool("Extra","fab fa-font-awesome","Icon",icons,options);
})()