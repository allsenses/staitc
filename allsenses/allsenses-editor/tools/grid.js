(function(){
	var grid=function(){
		engine.model.tool.call(this);
		this.type="div";
		this.class="grid-x grid-margin-x grid-padding-y";
		this.editable=false;
	}
	var cell=function(){
		engine.model.tool.call(this);
		this.type="div";
		this.class="cell large-4";
		this.editable=false;
		this.container=true;
	}
	var tool=function(){
		var obj=new grid();
		obj.content.push(new cell());
		obj.content.push(new cell());
		obj.content.push(new cell());
		engine.add.object(obj);
	}

	$(window).on("edit-init",function(event){
		var target=event.detail;
		if(target.type=="div" && target.class.search("grid-x")!=-1){
			var div=document.createElement("div");
			div.innerHTML="Cells:";
			var input=document.createElement("input");
			input.type="number";
			input.max=12;
			input.min=1;
			input.value=target.content.length;
			div.appendChild(input);
			$(input).on("change",function(event){
				var resize=function(){
					var sizes=[5,7,8,9,10,11];
					var l=target.content.length;
					target.content.forEach(function(e){
						if(sizes.includes(l)){
							if(l==5){
								e.class="cell large-2";
							}else{
								e.class="cell large-1";
							}
						}else{
							e.class="cell large-"+(12/l);
						}
					})
				}
				var val=this.value;
				if(target.content.length<val){
					for(var i=target.content.length;i<val;i++){
						target.content.push(new cell());
					}
					resize()
				}
				if(target.content.length>val){
					target.content[val].content.forEach(function(e){
						target.content[val-1].content.push(e);
					});
					target.content.splice(val,target.content.length);
					resize()
				}
				engine.clear();
			})
			engine.popup.add(div,event);
		}
		if(target.type=="div" && target.class.search("cell")!=-1){
			var div=document.createElement("div");
			div.innerHTML="Large:";
			var select=document.createElement("select");
			var l=target.class.split("large-")[1].split(" ")[0];
			for(var i=1;i<=12;i++){
				if(i==l){
					select.innerHTML+='<option selected value="'+i+'">'+i+'</option>';
				}else{
					select.innerHTML+='<option value="'+i+'">'+i+'</option>';
				}
			}
			div.appendChild(select);
			$(select).on("change",function(event){
				var val=this.value;
				target.class="cell large-"+val;
				engine.clear();
			})
			engine.popup.add(div,event);
		}
	})



	engine.tools.add("fal fa-table","Grid",tool);
})()