import { engine } from "../../init.js";

(function(){
	engine.plugin.tooltip={
		create:function(target,reload){
			engine.add.tab("properties").tag({
				tag:"hr"
			});
			engine.add.tab("properties").tag({
				tag:"div",
				class:"text-center pb-3",
				html:"Tooltip on hover"
			});

			var label=engine.add.tab("properties").tag({
				tag:"label",
				class:"spacing-label",
				html:"Title:"
			});

			var input=engine.model.tag({
				tag:"input",
				type:"text"
			});
			input.value=target.attr["title"] || "";

			label.appendChild(input);

			$(input).on("change",function(){
				if(this.value.split(" ").join("")!=""){
					target.data["tooltip"]="";
					target.attr["title"]=this.value;
					position.disabled=false;
					arrow.disabled=false;
					reload();
					engine.clear();
				}else{
					delete target.data["tooltip"];
					delete target.data["position"];
					delete target.data["alignment"];
					delete target.attr["title"];
					position.disabled=true;
					arrow.disabled=true;
					reload();
					engine.clear();
				}
			});

			var label=engine.add.tab("properties").tag({
				tag:"label",
				class:"spacing-label",
				html:"Position:"
			});

			var position=engine.model.tag({
				tag:"select"
			});
			position.addOption("Top","top");
			position.addOption("Bottom","bottom");
			position.addOption("Left","left");
			position.addOption("Right","right");
			position.value=target.data["position"] || "top";
			label.appendChild(position);
			if(input.value.split(" ").join("")=="") position.disabled=true;
			$(position).on("change",function(){
				target.data["position"]=this.value;
				reload();
				engine.clear();
			})

			var label=engine.add.tab("properties").tag({
				tag:"label",
				class:"spacing-label",
				html:"Arrow position:"
			});

			var arrow=engine.model.tag({
				tag:"select"
			});
			arrow.addOption("Left","left");
			arrow.addOption("Center","center");
			arrow.addOption("Right","right");
			arrow.value=target.data["alignment"] || "center";
			if(input.value.split(" ").join("")=="") arrow.disabled=true;
			label.appendChild(arrow);
			$(arrow).on("change",function(){
				target.data["alignment"]=this.value;
				reload();
				engine.clear();
			});
		}
	}

	$(window).on("engine-clear",function(){
		$(".tooltip").remove();
		engine.iframe.$("[data-tooltip]").foundation();
	})
})();