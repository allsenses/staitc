(function(){
	var grid=function(){
		engine.model.tool.call(this);
		this.module="grid";
		this.type="div";
		this.class="grid-x grid-margin-x grid-padding-y";
		this.editable=false;
	}
	var cell=function(){
		engine.model.tool.call(this);
		this.module="cell";
		this.type="div";
		this.class="cell large-4";
		this.firstClass="cell large-4";
		this.secondClass="";
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
		if(target.module=="grid"){
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
								e.firstClass="cell large-2";
							}else{
								e.firstClass="cell large-1";
							}
						}else{
							e.firstClass="cell large-"+(12/l);
						}
						e.class=e.firstClass+" "+e.secondClass;
					});
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
			});
			engine.popup.add(div,event);
		}
		if(target.module=="cell"){
			var div=document.createElement("div");
			div.innerHTML="Large:";
			var select=document.createElement("select");
			var l=target.firstClass.split("large-")[1].split(" ")[0];
			for(var i=1;i<=12;i++){
				if(i==l){
					select.innerHTML+='<option selected value="'+i+'">'+i+'</option>';
				}else{
					select.innerHTML+='<option value="'+i+'">'+i+'</option>';
				}
			}
			div.appendChild(select);
			
			var label=document.createElement("label");
			label.innerHTML="Class: ";
			var input=document.createElement("input");
			input.type="text";
			input.value=target.secondClass;
			input.placeholder="Class name";
			$(input).on("change",function(){
				target.secondClass=this.value;
				target.class=target.firstClass+" "+target.secondClass;
				engine.clear();
			});
			label.appendChild(input);
			div.appendChild(label);

			$(select).on("change",function(event){
				var val=this.value;
				target.firstClass="cell large-"+val;
				target.class=target.firstClass+" "+target.secondClass;
				engine.clear();
			})
			engine.popup.add(div,event);
		}
	})



	engine.tools.add("fal fa-table","Grid",tool);
})()