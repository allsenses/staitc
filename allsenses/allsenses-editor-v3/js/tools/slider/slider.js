import { engine } from "../../init.js";

(function(){
	engine.add.iframe.script("js/tools/slider/owl/owl.carousel.min.js",engine.clear);
	engine.add.iframe.style("js/tools/slider/slider.css");

	var item=function(src){
		engine.model.tool.call(this);
		this.module="slider-item";
		this.type="img";
		this.class="item p-0";
		this.src="" || src;
		this.editable=false;
		this.container=false;
		this.canFocus=false;
	}
	var slider=function(){
		engine.model.tool.call(this);
		this.module="slider";
		this.type="div";
		this.class=["owl-carousel","owl-theme","p-0"];
		this.lockClass.push("owl-carousel","owl-theme","p-0");
		this.content=[];
		this.editable=false;
		this.container=false;
		this.canDrag=true;
		this.data={
			"loop":"true",
			"autoplay":"true",
			"animateout":"fadeOut",
			"margin":"0",
			"nav":"false",
			"dots":"false",
			"items":"1",
			"center":"true",
			"autoplayspeed":"1000"
		}
	}


	var edit=function(){
		var target=engine.target;
		if(target.module=="slider"){
			engine.remove.tab("properties").content();
			var images=[];
			target.content.forEach(function(e){
				images.push(e.src);
			})
			engine.plugin.gallery.create({
				files:images,
				remove:function(id){
					target.content.splice(id,1);
				},
				callback:function(source){
					if(source){
						target.content.push(new item("/th/lg/"+source));
					}
					engine.clear();
					edit();
				}
			});

			engine.plugin.gallery.size({
				files:images,
				callback:function(sources){
					target.content=[];
					sources.forEach(function(e){
						target.content.push(new item(e));
					});
					engine.clear();
					edit();
				}
			})
			
			var label=engine.add.tab("properties").tag({
				tag:"label",
				html:"Loop:",
				class:"slider-select text-left"
			});
			var select=engine.model.tag({
				tag:"select",
			});
			select.addOption("Yes","true");
			select.addOption("No","false");

			select.value=target.data["loop"];
			$(select).on("change",function(){
				target.data["loop"]=this.value;
				engine.clear();
			});
			label.appendChild(select);


			var label=engine.add.tab("properties").tag({
				tag:"label",
				html:"Autoplay:",
				class:"slider-select text-left"
			});
			var select=engine.model.tag({
				tag:"select",
			});
			select.addOption("Yes","true");
			select.addOption("No","false");

			select.value=target.data["autoplay"];
			$(select).on("change",function(){
				target.data["autoplay"]=this.value;
				engine.clear();
			});
			label.appendChild(select);


			var label=engine.add.tab("properties").tag({
				tag:"label",
				html:"Animate out:",
				class:"slider-select text-left"
			});
			var select=engine.model.tag({
				tag:"select",
			});
			select.addOption("Fade","fadeOut");
			select.addOption("Slide","");
			select.value=target.data["animateout"];
			$(select).on("change",function(){
				target.data["animateout"]=this.value;
				engine.clear();
			});
			label.appendChild(select);


			var label=engine.add.tab("properties").tag({
				tag:"label",
				html:"Autoplay speed:",
				class:"slider-select text-left"
			});
			var input=engine.model.tag({
				tag:"input",
				type:"number"
			});
			input.value=target.data["autoplayspeed"];
			$(input).on("change",function(){
				target.data["autoplayspeed"]=this.value;
				engine.clear();
			});
			label.appendChild(input);


			var label=engine.add.tab("properties").tag({
				tag:"label",
				html:"Margin:",
				class:"slider-select text-left"
			});
			var input=engine.model.tag({
				tag:"input",
				type:"number"
			});
			input.value=target.data["margin"];
			$(input).on("change",function(){
				target.data["margin"]=this.value;
				engine.clear();
			});
			label.appendChild(input);


			var label=engine.add.tab("properties").tag({
				tag:"label",
				html:"Navigation:",
				class:"slider-select text-left"
			});
			var select=engine.model.tag({
				tag:"select",
			});
			select.addOption("Yes","true");
			select.addOption("No","false");
			select.value=target.data["nav"];
			$(select).on("change",function(){
				target.data["nav"]=this.value;
				engine.clear();
			});
			label.appendChild(select);


			var label=engine.add.tab("properties").tag({
				tag:"label",
				html:"Dots:",
				class:"slider-select text-left"
			});
			var select=engine.model.tag({
				tag:"select",
			});
			select.addOption("Yes","true");
			select.addOption("No","false");
			select.value=target.data["dots"];
			$(select).on("change",function(){
				target.data["dots"]=this.value;
				engine.clear();
			});
			label.appendChild(select);

			var label=engine.add.tab("properties").tag({
				tag:"label",
				html:"Center:",
				class:"slider-select text-left"
			});
			var select=engine.model.tag({
				tag:"select",
			});
			select.addOption("Yes","true");
			select.addOption("No","false");
			select.value=target.data["dots"];
			$(select).on("change",function(){
				target.data["dots"]=this.value;
				engine.clear();
			});
			label.appendChild(select);


			var label=engine.add.tab("properties").tag({
				tag:"label",
				html:"Items:",
				class:"slider-select text-left"
			});
			var input=engine.model.tag({
				tag:"input",
				type:"number"
			});
			input.value=target.data["items"];
			$(input).on("change",function(){
				target.data["items"]=this.value;
				engine.clear();
			});
			label.appendChild(input);

			engine.plugin.class.create(target,edit);
		}
	}

	$(window).on("engine-edit",edit);

	$(window).on("engine-clear",function(){
		engine.iframe.document.querySelectorAll(".owl-carousel").forEach(function(e){
			$(e).owlCarousel({
				loop:eval($(e).attr("data-loop")),
				autoplay:eval($(e).attr("data-autoplay")),
				animateOut:$(e).attr("data-animateout"),
				margin:Number($(e).attr("data-margin")),
				nav:eval($(e).attr("data-nav")),
				dots:eval($(e).attr("data-dots")),
				items:Number($(e).attr("data-items")),
				center:eval($(e).attr("data-center")),
				autoplaySpeed:Number($(e).attr("data-autoplayspeed")),
			});
		});
	});


	engine.add.tab("tools").tool("Extra","fal fa-presentation","Slider",slider);
})();


