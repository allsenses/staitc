import { engine } from "../../init.js";

(function(){
	engine.add.iframe.script("aos/aos.min.js",function(){
		engine.iframe.AOS.init();
	});
	engine.add.style(["aos/aos"]);
	engine.plugin.aos={
		create:function(target){
			engine.add.tab("properties").tag({
				tag:"hr"
			});
			engine.add.tab("properties").tag({
				tag:"div",
				class:"text-center pb-3",
				html:"Animation on scroll"
			});
			var label=engine.add.tab("properties").tag({
				tag:"label",
				class:"spacing-label",
				html:"Animation type:"
			});

			var select=engine.model.tag({
				tag:"select",
			});
			select.addOption("None","");
			
			var types=[
				"fade",
				"fade-up",
				"fade-down",
				"fade-left",
				"fade-right",
				"fade-up-right",
				"fade-up-left",
				"fade-down-right",
				"fade-down-left",
				"flip-up",
				"flip-down",
				"flip-left",
				"flip-right",
				"slide-up",
				"slide-down",
				"slide-left",
				"slide-right",
				"zoom-in",
				"zoom-in-up",
				"zoom-in-down",
				"zoom-in-left",
				"zoom-in-right",
				"zoom-out",
				"zoom-out-up",
				"zoom-out-down",
				"zoom-out-left",
				"zoom-out-right"
			];

			types.forEach(function(e){
				select.addOption(e,e);
			});

			select.value=target.data["aos"] || "";
			$(select).on("change",function(){
				if(this.value==""){
					delete target.data["aos"]
				}else{
					target.data["aos"]=this.value;
				}
				engine.clear();
			})

			label.appendChild(select);


			var label=engine.add.tab("properties").tag({
				tag:"label",
				class:"spacing-label",
				html:"Easing:"
			});
			

			var select=engine.model.tag({
				tag:"select",
			});
			select.addOption("None","");
			
			var types=[
				"linear",
				"ease",
				"ease-in",
				"ease-out",
				"ease-in-out",
				"ease-in-back",
				"ease-out-back",
				"ease-in-out-back",
				"ease-in-sine",
				"ease-out-sine",
				"ease-in-out-sine",
				"ease-in-quad",
				"ease-out-quad",
				"ease-in-out-quad",
				"ease-in-cubic",
				"ease-out-cubic",
				"ease-in-out-cubic",
				"ease-in-quart",
				"ease-out-quart",
				"ease-in-out-quart"
			  ];

			types.forEach(function(e){
				select.addOption(e,e);
			});

			select.value=target.data["aos-easing"] || "";
			$(select).on("change",function(){
				if(this.value==""){
					delete target.data["aos-easing"]
				}else{
					target.data["aos-easing"]=this.value;
					engine.clear();
				}
			});

			label.appendChild(select);


			var label=engine.add.tab("properties").tag({
				tag:"label",
				class:"spacing-label",
				html:"Delay:"
			});

			var input=engine.model.tag({
				tag:"input",
				type:"number"
			});
			input.value=target.data["aos-delay"] || 0;

			$(input).on("change",function(){
				if(this.value=="0"){
					delete target.data["aos-delay"];
				}else{
					target.data["aos-delay"]=this.value;
				}
				engine.clear();
			});

			label.appendChild(input);

			var label=engine.add.tab("properties").tag({
				tag:"label",
				class:"spacing-label",
				html:"Duration:"
			});

			var input=engine.model.tag({
				tag:"input",
				type:"number"
			});
			input.value=target.data["aos-duration"] || 0;

			$(input).on("change",function(){
				if(this.value=="0"){
					delete target.data["aos-duration"];
				}else{
					target.data["aos-duration"]=this.value;
				}
				engine.clear();
			});

			label.appendChild(input);
		}
	}


	$(window).on("engine-clear",function(){
		//engine.iframe.AOS.init();
	});
})();