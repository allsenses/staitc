(function(){

	var simpleContainer=function(){
		engine.model.tool.call(this);
		engine.plugin.spacing.model.call(this);
		this.module="simplecontainer"
		this.type="div";
		this.class=["gallery","grid-x"];
		this.editable=false;
		this.container=false;
		this.canDrag=true;
		this.content=[
			new simpleLink()
		]
	}

	var simpleLink=function(){
		engine.model.tool.call(this);
		engine.plugin.spacing.model.call(this);
		this.module="simplelink"
		this.type="a";
		this.class=["simple-image","cell","auto"]
		this.editable=false;
		this.container=false;
		this.canRemove=false;
		this.href="/public/phpthumb/images/noimage.jpg";
		this.content=[
			new simpleMask(),
		]
	}

	var simpleImage=function(){
		engine.model.tool.call(this);
		this.module="simpleimage";
		this.type="img";
		this.src="/public/phpthumb/images/noimage.jpg";
		this.editable=false;
		this.canFocus=false;
		this.alt="";
	}

	var simpleMask=function(){
		engine.model.tool.call(this);
		this.module="simplemask";
		this.type="span";
		this.class=["mask"];
		this.editable=false;
		this.canFocus=false;
		this.content=[
			new simpleImage()
		]
	}

	
	var edit=function(){
		var target=engine.target;
		if(target.module=="simplecontainer"){
			engine.remove.tab("properties").content();
			var label=engine.add.tab("properties").tag({
				tag:"label",
				class:"spacing-label",
				html:"Number of images:"
			})
			var input=engine.model.tag({
				tag:"input",
				type:"number",
				value:target.content.length || 1
			});

			$(input).on("change",function(){
				if(this.value<=1)this.value=1;
				if(this.value>target.content.length){
					for(var i=target.content.length;i<this.value;i++){
						target.content.push(new simpleLink());
					}
				}
				if(this.value<target.content.length){
					for(var i=target.content.length;i>this.value;i--){
						target.content.splice(target.content.length-1,1);
					}
				}
				engine.clear();
			});

			label.appendChild(input);
		}
		if(target.module=="simplelink"){
			engine.remove.tab("properties").content();
			engine.plugin.gallery.create({
				files:[target.content[0].content[0].src],
				callback:function(source){
					if(source){
						target.content[0].content[0].src="/th/lg/"+source;
						target.href="/th/lg/"+source;
					}
					edit();
					engine.clear();
				}
			});
			engine.plugin.gallery.size({
				files:[target.content[0].content[0].src],
				callback:function(sources){
					target.content[0].content[0].src=sources[0];
					engine.clear();
				}
			});

			
			var input=engine.add.tab("properties").tag({
				tag:"input",
				placeholder:"Alt text...",
				value: target.content[0].alt,
			});
			$(input).on("change",function(){
				target.content[0].alt=this.value;
				engine.clear();
			})

			engine.add.tab("properties").tag({
				tag:"hr"
			});

			var check=target.content[0].class.split(" ").includes("mask");
			var input=engine.add.tab("properties").tag({
				tag:"checkbox",
				html:"Mask:",
				checked:check
			});

			$(input.querySelector("input")).on("change",function(){
				if(this.checked){
					target.content[0].class="mask";
				}else{
					target.content[0].class="";
				}
				engine.clear();
			})

			engine.plugin.spacing.create(target,edit);
		}
	}

	$(window).on("engine-edit",edit);
	
	engine.add.tab("tools").tool("Extra","fas fa-images","Gallery",simpleContainer);
})();