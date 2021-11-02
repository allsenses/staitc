(function(){
	engine.add.style(["spacing/spacing"]);
	engine.plugin.spacing={
		create:function(target,reload){
			engine.properties.add({
				tag:"hr"
			});

			var label=engine.properties.add({
				tag:"label",
				html:"Text color:",
				class:"text-left spacing-label"
			});

			var input=engine.create.tag({
				tag:"input",
				type:"color",
			});
			input.value=target.color;
			label.appendChild(input);

			$(input).on("change",function(){
				target.color=this.value;
				target.style="color:"+this.value+";";
				engine.clear();
			});

			var label=engine.properties.add({
				tag:"label",
				html:"Align:",
				class:"text-left spacing-label"
			});
			var select=engine.create.tag({
				tag:"select",
			});
			select.addOption("Left","text-left");
			select.addOption("Center","text-center");
			select.addOption("Right","text-right");
			var classList=target.class.split(" ");
			if(classList.join("")=="") classList=[];
			select.value="text-left"
			if(classList.includes("text-left")) select.value="text-left";
			if(classList.includes("text-center")) select.value="text-center";
			if(classList.includes("text-right")) select.value="text-right";

			$(select).on("change",function(){
				var classList=target.class.split(" ");
				if(classList.join("")=="") classList=[];
				classList.remove("text-left");
				classList.remove("text-center");
				classList.remove("text-right");
				classList.push(this.value);
				target.class=classList.join(" ");
				engine.clear();
			});
			label.appendChild(select);

			var div=engine.properties.add({
				tag:"div",
				class:"grid-x grid-padding-y align-middle padding-options"
			});
			
			var cell=engine.create.tag({
				tag:"div",
				class:"cell small-3"
			});

			var a=engine.create.tag({
				tag:"a",
				html:'<i class="fal fa-lock-open-alt"></i>',
				class:"button spacing-locker"
			});

			if(target.padding.all){
				a.innerHTML='<i class="fal fa-lock-alt"></i>';
				a.classList.add("active")
			}

			$(a).on("click",function(){
				if(target.padding.all){
					target.padding.all=false;
					a.innerHTML='<i class="fal fa-lock-open-alt"></i>';
					this.classList.remove("active");
					return;
				};
				target.padding.all=true;
				a.innerHTML='<i class="fal fa-lock-alt"></i>';
				this.classList.add("active");
			})
			cell.appendChild(a);
			div.appendChild(cell);

			var cell=engine.create.tag({
				tag:"div",
				class:"cell small-9"
			});

			var select=engine.create.tag({
				tag:"select",
				data:"top"
			});
			select.addOption("Auto","")
			for(var i=1;i<=8;i++){
				select.addOption(i,i);
			}
			select.value=target.padding.top;
			
			$(select).on("change",function(){
				apply(target,this,reload);
			});
			cell.appendChild(select);


			var select=engine.create.tag({
				tag:"select",
				class:"spacing-select",
				data:"left"
			});
			select.addOption("Auto","")
			for(var i=1;i<=8;i++){
				select.addOption(i,i);
			}
			select.value=target.padding.left;
			
			$(select).on("change",function(){
				apply(target,this,reload);
			});
			cell.appendChild(select);


			var select=engine.create.tag({
				tag:"select",
				class:"spacing-select",
				data:"right"
			});
			select.addOption("Auto","")
			for(var i=1;i<=8;i++){
				select.addOption(i,i);
			}
			select.value=target.padding.right;
			
			$(select).on("change",function(){
				apply(target,this,reload);
			});
			cell.appendChild(select);


			var select=engine.create.tag({
				tag:"select",
				data:"bottom"
			});
			select.addOption("Auto","")
			for(var i=1;i<=8;i++){
				select.addOption(i,i);
			}
			select.value=target.padding.bottom;
			
			$(select).on("change",function(){
				apply(target,this,reload);
			});
			cell.appendChild(select);
			div.appendChild(cell);
		},
		model:function(){
			this.color="";
			this.padding={
				all:"",
				top:"",
				bottom:"",
				left:"",
				right:""
			};
			for(var i=0;i<=8;i++){
				this.lockClass.push("pt-"+i)
				this.lockClass.push("pb-"+i)
				this.lockClass.push("pl-"+i)
				this.lockClass.push("pr-"+i)
			}
			this.lockClass.push("text-left");
			this.lockClass.push("text-center");
			this.lockClass.push("text-right");
		}
	}

	var apply=function(target,that,reload){
		var classList=target.class.split(" ");
		if(classList.join("")=="") classList=[];
		for(var i=0;i<=8;i++){
			classList.remove("pt-"+i);
			classList.remove("pb-"+i);
			classList.remove("pl-"+i);
			classList.remove("pr-"+i);
		}

		if(target.padding.all){
			target.padding.top=that.value;
			target.padding.bottom=that.value;
			target.padding.left=that.value;
			target.padding.right=that.value;
		}else{
			var data=$(that).attr("data-obj");
			target.padding[data]=that.value;
		}
		if(target.padding.top)classList.push("pt-"+target.padding.top);
		if(target.padding.bottom)classList.push("pb-"+target.padding.bottom);
		if(target.padding.left)classList.push("pl-"+target.padding.left);
		if(target.padding.right)classList.push("pr-"+target.padding.right);
		target.class=classList.join(" ");


		reload();
		engine.clear();
	}
})();