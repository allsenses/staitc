(function(){
	engine.add.style(["link/link"]);
	var link=function(){
		engine.model.tool.call(this);
		this.type="a";
		this.module="link";
		this.editable=false;
		this.canDrag=true;
		this.container=true;
		this.href="";
		this.menu="0";
	}



	var edit=function(){
		var target=engine.target;
		if(target.module=="link"){
			engine.remove.tab("properties").content();
			engine.plugin.link.create(target,edit);
			engine.plugin.class.create(target,edit);
		}
	}

	engine.plugin.link={
		create:function(target,reload){
			var label=engine.add.tab("properties").tag({
				tag:"label",
				class:"spacing-label",
				html:"Menu url:"
			});

			var select=engine.model.tag({
				tag:"select"
			});
			select.addOption("None","0");
			var l=Object.keys(menu);
			for(var i=0;i<l.length;i++){
				select.addOption(menu[l[i]].title,l[i]);
			};
			select.value=target.menu;

			$(select).on("change",function(){
				if(this.value==0){
					target.menu=this.value;
					target.href="";
				}else{
					target.menu=this.value;
					target.href='[menu '+this.value+' url]';
				}
				reload();
				engine.clear();
			})

			label.appendChild(select);

			var label=engine.add.tab("properties").tag({
				tag:"label",
				class:"spacing-label",
				html:"Url:"
			})

			var input=engine.model.tag({
				tag:"input",
				type:"text",
				disabled:true,
				placeholder:"URL...",
				value:target.href
			});
			if(target.menu=="0"){
				input.disabled=false;
			}

			$(input).on("change",function(){
				target.menu="0";
				target.href=this.value;
				engine.clear();
			})

			label.appendChild(input);

			var label=engine.add.tab("properties").tag({
				tag:"label",
				class:"spacing-label",
				html:"Target:"
			});

			var select=engine.model.tag({
				tag:"select"
			});
			select.addOption("None","");
			select.addOption("_blank","_blank");
			select.addOption("_self","_self");
			select.addOption("_parent","_parent");
			select.addOption("_top","_top");
			select.value=target.attr["target"];

			$(select).on("change",function(){
				if(this.value==""){
					delete target.attr["target"];
					return;
				}
				target.attr["target"]=this.value;
				engine.clear();
			})

			label.appendChild(select);


			var input=engine.add.tab("properties").tag({
				tag:"checkbox",
				html:"No follow:",
				checked:target.attr["rel"]
			});

			$(input.querySelector("input")).on("change",function(){
				if(this.checked){
					target.attr["rel"]="nofollow noopener noreferrer";
				}else{
					delete target.attr["rel"];
				}
				engine.clear();
			});
		}
	}


	$(window).on("engine-edit",edit);

	engine.add.tab("tools").tool("Basic","fal fa-link","Link",link);
})();