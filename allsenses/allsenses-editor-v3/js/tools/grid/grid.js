import { engine } from "../../init.js";

(function(){
	engine.add.style(["grid/grid"]);
	var cell=function(className,content){
		engine.model.tool.call(this);
		engine.plugin.spacing.model.call(this);
		this.module="cell";
		this.type="div";
		this.lockClass.push("cell");
		for(var i=1;i<=12;i++){
			this.lockClass.push("small-"+i);
			this.lockClass.push("medium-"+i);
			this.lockClass.push("large-"+i);
		}
		for(var i=1;i<=6;i++){
			this.lockClass.push("small-order-"+i);
			this.lockClass.push("medium-order-"+i);
			this.lockClass.push("large-order-"+i);
		}
		if(className){
			this.class=className;
		}else{
			this.class.push("cell","large-4");
		}
		this.content=content || [];
		this.editable=false;
		this.container=true;
		this.canRemove=false;
		this.canDrag=false;
	}
	var grid=function(){
		engine.model.tool.call(this);
		this.module="grid";
		this.type="div";
		this.class.push("grid-x","grid-padding-x","grid-padding-y");
		this.content=[
			new cell(),
			new cell(),
			new cell()
		];
		this.editable=false;
		this.container=false;
		this.canRemove=true;
		this.canDrag=true;
	}

	$(window).on("engine-edit",function(){
		var target=engine.target;
		if(target.module=="grid"){
			align(target);

			addTemplate(target,"4,4,4");
			addTemplate(target,"6,6");
			addTemplate(target,"4,8");
			addTemplate(target,"8,4");
			addTemplate(target,"3,9");
			addTemplate(target,"9,3");

			var input=engine.add.tab("properties").tag({
				tag:"input",
				type:"text",
				placeholder:"4,4,4",
				class:"text-center"
			});
			$(input).on("change",function(){
				changeCells(target,this.value);
			});
			$(input).on("input",function(){
				this.value=this.value.replace(/[^0-9\,]/,"");
			});
			
		}

		if(target.module=="cell"){
			edit();
		}
	});


	$(window).on("engine-move",function(event){
		var target=engine.target;
		if(target.module=="cell"){
			target.parent.forEach(function(e){
				var classList=e.class;
				for(var i=1;i<=6;i++){
					classList.remove("small-order-"+i);
					classList.remove("medium-order-"+i);
					classList.remove("large-order-"+i);
				}
				e.class=classList;
			});
			edit();
		}
	});

	var align=function(target){
		var label=engine.add.tab("properties").tag({
			tag:"label",
			class:"spacing-label",
			html:"Vertical align:"
		});
		
		
		var select=engine.model.tag({
			tag:"select",
		});

		select.addOption("None","");
		select.addOption("Top","align-top");
		select.addOption("Middle","align-middle");
		select.addOption("Bottom","align-bottom");

		var classList=target.class;
		if(classList.includes("align-top")) select.value="align-top";
		if(classList.includes("align-middle")) select.value="align-middle";
		if(classList.includes("align-bottom")) select.value="align-bottom";

		$(select).on("change",function(){
			var classList=target.class;
			classList.remove("align-top");
			classList.remove("align-middle");
			classList.remove("align-bottom");
			classList.push(this.value);
			target.class=classList;
			engine.clear();
		});

		label.appendChild(select);
	}

	var addTemplate=function(target,cols){
		var icon=cols.split(",").join("");
		var title=cols.split(",").join("-");
		var a=engine.add.tab("properties").tag({
			tag:"a",
			class:"grid-option",
			html:'<i class="icon icon-'+icon+'"></i><br>'+title
		});
		$(a).on("click",function(){
			changeCells(target,cols);
		})
	}


	var edit=function(){
		var target=engine.target;
		if(target.module=="cell"){
			engine.remove.tab("properties").content();
			
			createSize(target,"small");
			createSize(target,"medium");
			createSize(target,"large");

			engine.add.tab("properties").tag({
				tag:"hr"
			})

			ordering(target,"small");
			ordering(target,"medium");
			ordering(target,"large");

			engine.plugin.spacing.create(target,edit);
			engine.plugin.aos.create(target);
			engine.plugin.tooltip.create(target,edit);
			engine.plugin.class.create(target,edit);
		}
	}

	var createSize=function(target,size){
		var label=engine.add.tab("properties").tag({
			tag:"label",
			class:"spacing-label",
			html:size.charAt(0).toUpperCase()+size.slice(1)+" size:"
		});
		var select=engine.model.tag({
			tag:"select"
		});
		select.addOption("None","none");
		for(var i=1;i<=12;i++){
			select.addOption(i,i);
		}
		
		var classList=target.class;
		for(var i=1;i<=12;i++){
			if(classList.includes(size+"-"+i)){
				select.value=i;
			}
		}

		$(select).on("change",function(){
			var classList=target.class;
			for(var i=1;i<=12;i++){
				classList.remove(size+"-"+i);
			}
			if(this.value!="none"){
				classList.push(size+"-"+this.value);
			}
			target.class=classList;
			engine.clear();
		});
		label.appendChild(select);
	}

	var ordering=function(target,size){
		var label=engine.add.tab("properties").tag({
			tag:"label",
			class:"spacing-label",
			html:size.charAt(0).toUpperCase()+size.slice(1)+" order:"
		});
		var select=engine.model.tag({
			tag:"select"
		});
		select.addOption("None","none");
		for(var i=1;i<=6;i++){
			select.addOption(i,i);
		}
		
		var classList=target.class;
		for(var i=1;i<=6;i++){
			if(classList.includes(size+"-order-"+i)){
				select.value=i;
			}
		}

		$(select).on("change",function(){
			var classList=target.class;
			for(var i=1;i<=6;i++){
				classList.remove(size+"-order-"+i);
			}
			if(this.value!="none"){
				classList.push(size+"-order-"+this.value);
			}
			target.class=classList;
			engine.clear();
		});
		label.appendChild(select);
	}


	var options=function(target){
		var form=engine.add.popup("Grid type");
		var a=form.tag({
			tag:"a",
			class:"grid-option",
			html:'<i class="icon icon-66"></i><br>6-6'
		});
		$(a).on("click",function(){
			changeCells(target,"6,6");
			engine.hide.popup();
		});

		var a=form.tag({
			tag:"a",
			class:"grid-option",
			html:'<i class="icon icon-444"></i><br>4-4-4'
		});
		$(a).on("click",function(){
			changeCells(target,"4,4,4");
			engine.hide.popup();
		});
		
		var a=form.tag({
			tag:"a",
			class:"grid-option",
			html:'<i class="icon icon-48"></i><br>4-8'
		});
		$(a).on("click",function(){
			changeCells(target,"4,8");
			engine.hide.popup();
		});

		var a=form.tag({
			tag:"a",
			class:"grid-option",
			html:'<i class="icon icon-84"></i><br>8-4'
		});
		$(a).on("click",function(){
			changeCells(target,"8,4");
			engine.hide.popup();
		});

		var a=form.tag({
			tag:"a",
			class:"grid-option",
			html:'<i class="icon icon-39"></i><br>3-9'
		});
		$(a).on("click",function(){
			changeCells(target,"3,9");
			engine.hide.popup();
		});

		var a=form.tag({
			tag:"a",
			class:"grid-option",
			html:'<i class="icon icon-93"></i><br>9-3'
		});
		$(a).on("click",function(){
			changeCells(target,"9,3");
			engine.hide.popup();
		});

		var input=form.tag({
			tag:"input",
			type:"text",
			placeholder:"4,4,4",
			class:"text-center"
		});
		$(input).on("input",function(){
			this.value=this.value.replace(/[^0-9\,]/,"");
		});

		$(form).on("submit",function(){
			changeCells(target,input.value);
		});
	}

	var changeCells=function(target,value){
		var defaultSum=36;
		var cells=value.split(",");
		cells.splice(defaultSum,cells.length);
		var content=[];
		target.content.forEach(function(e){
			content=content.concat(e.content);
		});
		target.content=[];
		var sum=0;
		for(var i=0;i<cells.length;i++){
			var e=cells[i];
			if(e>defaultSum){e=defaultSum}
			sum+=Number(e);
			if(sum<=defaultSum){
				if(i==0){
					target.content.push(new cell(["cell","large-"+e],content));
				}else{
					target.content.push(new cell(["cell","large-"+e]));
				}
			}
		}
		engine.clear();
	}
	
	engine.add.tab("tools").tool("Basic","fal fa-table","Grid",grid,options);
})();