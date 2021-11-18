import { engine } from "../../init.js";

(function(){

	var maps=function(){
		engine.model.tool.call(this);
		engine.plugin.spacing.model.call(this);
		this.module="maps";
		this.type="iframe";
		this.editable=false;
		this.canDrag=true;
		this.src="https://maps.google.com/maps?q=Allsenses Agencja Interaktywna Jelenia Góra 58-560";
		this.zoom=15;
		this.q="Allsenses Agencja Interaktywna Jelenia Góra 58-560";
		this.src="https://maps.google.com/maps?q="+this.q+"&z="+this.zoom+"&t=&ie=UTF8&iwloc=&output=embed";
		this.attr={
			"style":"height:420px"
		}
		this.height=420;
	}




	var edit=function(){
		var target=engine.target;
		var currentTarget=engine.element;
		if(target.module=="maps"){
			engine.remove.tab("properties").content();
			var label=engine.add.tab("properties").tag({
				tag:"label",
				class:"spacing-label",
				html:"Localization:"
			});
			var input=engine.model.tag({
				tag:"input",
				value:target.q
			});
			$(input).on("input",function(){
				target.q=this.value;
				target.src="https://maps.google.com/maps?q="+target.q+"&z="+target.zoom+"&t=&ie=UTF8&iwloc=&output=embed";
				engine.clear();
			});
			label.appendChild(input);


			var label=engine.add.tab("properties").tag({
				tag:"label",
				class:"spacing-label",
				html:"Height:"
			});

			var input=engine.model.tag({
				tag:"input",
				type:"range"
			});
			input.min=120;
			input.max=1440;
			input.value=target.height;

			$(input).on("input",function(){
				target.height=this.value;
				target.attr["style"]="height:"+target.height+"px";
				$(currentTarget).attr("style",target.attr["style"]);
			});

			label.appendChild(input);

			engine.plugin.spacing.create(target,edit);
			engine.plugin.class.create(target,edit);
		}
	}


	$(window).on("engine-edit",edit);

	engine.add.tab("tools").tool("Extra","fal fa-map-marked-alt","Maps",maps);
})();
