var engine={
	data:[],
	target:null,
	draggable:null,
	init:function(container){
		var div=document.createElement("div");
		div.className="allsenses-editor";
		div.innerHTML='<div class="tools"></div><div class="toolbox"></div><div class="edit"><a class="edit-init fal fa-edit"></a><div class="options"></div></div><div class="container"></div><div class="popup"></div>'


		var a=document.createElement("a");
		a.className="add add-main";
		a.innerHTML='<i class="fas fa-plus"></i>';
		$(a).on("click",engine.tools.show);
		div.appendChild(a);
		$(container)[0].appendChild(div);

		$(".allsenses-editor .edit .options").html('<a class="drag fal fa-arrows" draggable="true"></a><a class="edit-up fal fa-angle-up"></a><a class="edit-down fal fa-angle-down"></a><a class="remove fal fa-trash"></a>');

		$(".allsenses-editor .edit").on("mousemove",function(){
			$(this).addClass("active");
			if(engine.edit.target.draggable){
				$(".allsenses-editor .drag").addClass("active");
			}else{
				$(".allsenses-editor .drag").removeClass("active");
			}
			engine.edit.target.focus=true;
			$(engine.edit.currentTarget).addClass("active");
		});
		$(".allsenses-editor .edit").on("mouseleave",function(){
			$(this).removeClass("active");
			$(".allsenses-editor .drag").removeClass("active");
			engine.edit.target.focus=false;
			$(engine.edit.currentTarget).removeClass("active");
		});
		$(".allsenses-editor .edit a.edit-init").on("click",engine.edit.init);
		$(".allsenses-editor .edit a.remove").on("click",engine.edit.remove);
		$(".allsenses-editor .edit a.edit-up").on("click",engine.edit.up);
		$(".allsenses-editor .edit a.edit-down").on("click",engine.edit.down);
		$(".allsenses-editor .edit a.drag").on("dragstart",function(event){
			if(engine.edit.target.draggable){
				$(".allsenses-editor .add").addClass("active");
				engine.draggable=engine.edit.target;
			}
		});
		$(".allsenses-editor .edit a.drag").on("dragend",function(event){
				$(".allsenses-editor .add").removeClass("active");
		});
		$(window).on("click",engine.tools.hide);
		require(modules);
		engine.clear();
	},

	add:{
		object:function(obj){
			engine.target.push(obj);
			$(".allsenses-editor .container").html("");
			engine.render(engine.data,".allsenses-editor .container");
		}
	},

	clear:function(){
		$(".allsenses-editor .container").html("");
		engine.render(engine.data,".allsenses-editor .container");
	},

	render:function(data,container){
		var i=0;
		data.forEach(function(e){
			e.id=i++;
			e.parent=data;
			var obj=document.createElement(e.type);
			obj.engineTarget=e;
			obj.className=e.class;
			obj.alt=e.alt;
			obj.src=e.src;
			obj.textOptions=e.textOptions;
			if(e.focus){
				obj.classList.add("active");
			}else{
				obj.classList.remove("active");
			}
			obj.contentEditable=e.editable || false;
			obj.spellcheck=e.spellcheck || false;
			if(!e.container && e.editable){
				obj.innerHTML=e.text || "";
			}
			$(obj).attr("data-placeholder",e.placeholder);
			$(obj).attr("data-container",e.container);
			$(obj).on("keyup",function(event){
				var text=event.currentTarget.innerHTML;
				this.engineTarget.text=text;
			})
			$(obj).on("mousemove",function(event){
				if(e.editable || (!e.editable && !e.container)){
					engine.edit.show(event);
				}
				if(e.container){
					engine.edit.show(event,"bottom")
				}
			})
			$(obj).on("mousedown",function(event){
				event.stopPropagation();
				if(!e.textOptions){
					engine.toolbox.hide();
				}
			});

			if(e.textOptions){
				$(obj)[0].addEventListener("mouseup",function(event){
					event.stopPropagation();
					var customevent=new CustomEvent("edit-selection",{detail:{object:e,$:obj}});
					window.dispatchEvent(customevent);
				},false);
				$(obj)[0].addEventListener("contextmenu",function(event){
					event.stopPropagation();
					var customevent=new CustomEvent("edit-selection",{detail:{object:e,$:event}});
					window.dispatchEvent(customevent);
				},false);
				$(obj)[0].addEventListener("keydown",function(event){
					if(event.key=="Enter" && !event.shiftKey){
						if(!document.queryCommandState("insertUnorderedList") && !document.queryCommandState("insertOrderedList")){
							document.execCommand("formatBlock",false,"p");
						}
					}
					if(event.key=="V" && event.shiftKey && event.ctrlKey){
						document.execCommand("formatBlock",false,"p");
					}
				},false);
			}
			if(e.editable && e.textOptions){
				$(obj)[0].addEventListener("paste",function(event){
					this.innerHTML=event.clipboardData.getData("text/plain");
					event.preventDefault();
				},false);
			}
			$(obj).on("mouseleave",engine.edit.hide)
			engine.render(e.content,obj);
			if(e.container){
				var a=document.createElement("a");
				a.className="add";
				a.innerHTML='<i class="fas fa-plus"></i>';
				a.engineTarget=e;
				$(a).on("click",engine.tools.show);
				$(a).on("drop",function(event){
					event.preventDefault();
					var data=engine.draggable;
					if(data){
						for(var i=0;i<data.parent.length;i++){
							if(data.parent[i]===data){
								data.parent.splice(i,1);
							}
						}
						this.engineTarget.content.push(data);
						engine.draggable=null;
						engine.clear();
					}
				})
				$(a).on("dragover",function(event){
					event.preventDefault();
				});
				obj.appendChild(a);
			}
			$(container)[0].appendChild(obj);
		})
	},

	generate:function(data){
		data=data || engine.data;
		data.forEach(function(e){
			delete e.parent;
			engine.generate(e.content);
		});
		if(data==engine.data){
			return engine.data;
		}	
	},

	html:document.createElement("section"),
	rawHTML:function(data,container){
		data=data || engine.data;
		if(data==engine.data){
			engine.html=document.createElement("section");
		}
		container=container || engine.html;
		data.forEach(function(e){
			var obj=document.createElement(e.type);
			obj.engineTarget=e;
			obj.className=e.class;
			obj.alt=e.alt;
			obj.src=e.src;
			if(!e.container && e.editable){
				obj.innerHTML=e.text || "";
			}
			engine.rawHTML(e.content,obj);
			container.appendChild(obj);
		});
		if(data==engine.data){
			return engine.html.innerHTML;
		}
	},

	edit:{
		target:null,
		currentTarget:null,
		show:function(event,pos){
			event.stopPropagation();
			var scroll=$(".allsenses-editor")[0].getBoundingClientRect();
			var rect=$(event.currentTarget)[0].getBoundingClientRect();
			var edit=$(".allsenses-editor .edit")[0].getBoundingClientRect();
			var x=scroll.right-rect.right;
			var y=rect.top-scroll.top;
			if(pos=="bottom"){
				y=rect.top+rect.height-edit.height-scroll.top;
			}
			$(".allsenses-editor .edit").attr("style","top:"+y+"px;right:"+x+"px");
			$(".allsenses-editor .edit").addClass("active");
			engine.edit.target=event.currentTarget.engineTarget;
			engine.edit.currentTarget=event.currentTarget;
		},
		hide:function(event){
			$(event.currentTarget).removeClass("active");
			$(".allsenses-editor .edit").removeClass("active");
		},
		remove:function(){
			engine.clear();
			if(confirm("Usunąć obiekt?")){
				engine.edit.target.parent.splice(engine.edit.target.id,1);
			}
			engine.clear();
		},
		up:function(){
			engine.clear();
			if(engine.edit.target.id-1>=0){
				var temp=engine.edit.target;
				var prev=engine.edit.target.parent[engine.edit.target.id-1];
				engine.edit.target.parent[engine.edit.target.id-1]=temp;
				engine.edit.target.parent[engine.edit.target.id]=prev;
				engine.clear();
			}
		},
		down:function(){
			engine.clear();
			if(engine.edit.target.parent.length>engine.edit.target.id+1){
				var temp=engine.edit.target;
				var next=engine.edit.target.parent[engine.edit.target.id+1];
				engine.edit.target.parent[engine.edit.target.id+1]=temp;
				engine.edit.target.parent[engine.edit.target.id]=next;
				engine.clear();
			}
		},
		init:function(event){
			var customevent=new CustomEvent("edit-init",{detail:engine.edit.target});
			window.dispatchEvent(customevent);
		}
	},

	tools:{
		add:function(icon,name,callback){
			var a=document.createElement("a");
			a.className="tool"
			a.innerHTML='<i class="'+icon+'"></i>'+name;
			$(a).on("click",callback);
			$(".allsenses-editor .tools")[0].appendChild(a);
		},
		show:function(event){
			var scroll=$(".allsenses-editor")[0].getBoundingClientRect();
			var rect=$(event.currentTarget)[0].getBoundingClientRect();
			var tools=$(".allsenses-editor .tools")[0].getBoundingClientRect();
			var x=rect.left-tools.width/2+rect.width/2-scroll.left;
			var y=rect.top+rect.height-scroll.top;
			$(".allsenses-editor .tools").addClass("active");
			$(".allsenses-editor .tools").attr("style","top:"+y+"px;left:"+x+"px")
			event.preventDefault();
			event.stopPropagation();
			if(event.currentTarget.classList.contains("add-main")){
				engine.target=engine.data;
			}else{
				engine.target=event.currentTarget.engineTarget.content;
			}
		},

		hide:function(){
			$(".allsenses-editor .tools").removeClass("active");
		}
	},

	toolbox:{
		show:function(obj,options){
			var scroll=$(".allsenses-editor")[0].getBoundingClientRect();
			var toolbox=$(".allsenses-editor .toolbox")[0].getBoundingClientRect();
			if(obj.type=="contextmenu"){
				var x=obj.clientX-scroll.left;
				if(obj.clientX-scroll.left+toolbox.width>scroll.width){
					x=scroll.width-toolbox.width;
				}
				var y=obj.clientY-toolbox.height-scroll.top;
			}else{
				var rect=obj.getBoundingClientRect();
				var x=rect.x-scroll.left;
				if(rect.x-scroll.left+toolbox.width>scroll.width){
					x=rect.x-scroll.left-toolbox.width+rect.width;
				}
				var y=rect.y-toolbox.height-scroll.top;
			}
			$(".allsenses-editor .toolbox").attr("style","top:"+y+"px;left:"+x+"px")
			$(".allsenses-editor .toolbox").html("");
			options.forEach(function(e){
				if(e=="line"){
					var hr=document.createElement("hr");
					$(".allsenses-editor .toolbox")[0].appendChild(hr);
				}else{
					var button=document.createElement("button");
					button.className=e.icon;
					if(e.active){
						button.classList.add("active");
					}
					$(button).on("click",function(event){
						event.preventDefault();
						return false;
					});
					$(button).on("click",e.click);
					button.innerHTML='<i class="fas fa-'+e.icon+'"></i>';
					$(".allsenses-editor .toolbox")[0].appendChild(button);
				}
			});
			$(".allsenses-editor .toolbox").addClass("active");
		},

		hide:function(){
			$(".allsenses-editor .toolbox").removeClass("active");
		}
	},

	popup:{
		show:function(pos){
			if(pos=="center"){
				$(".allsenses-editor .popup").attr("style","position:fixed;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);width:auto;overflow:auto;height:auto;max-height:70%");
			}else{
				var scroll=$(".allsenses-editor")[0].getBoundingClientRect();
				var rect=$(".allsenses-editor .edit")[0].getBoundingClientRect();
				var popup=$(".allsenses-editor .popup")[0].getBoundingClientRect();
				var x=rect.left-popup.width/2+rect.width/2-scroll.left;
				if(scroll.width<x+popup.width){
					x=scroll.width-popup.width-20;
				}
				var y=rect.top+rect.height-scroll.top;
				$(".allsenses-editor .popup").attr("style","top:"+y+"px;left:"+x+"px")
			}
			$(".allsenses-editor .popup").addClass("active");
		},

		hide:function(){
			$(".allsenses-editor .popup").removeClass("active");
			return false;
		},

		add:function(obj,pos,submit){
			submit=submit || null;
			$(".allsenses-editor .popup").html("");
			$(".allsenses-editor .popup")[0].appendChild(obj);
			var button=document.createElement("button");
			button.type="submit";
			button.innerHTML='<i class="fas fa-check"></i>'
			$(button).on("click",engine.popup.hide);
			$(button).on("click",submit);
			$(".allsenses-editor .popup")[0].appendChild(button);
			engine.popup.show(pos);
		}
	},

	model:{
		tool:function(){
			this.type="h1";
			this.class="";
			this.text="";
			this.src="";
			this.placeholder="";
			this.content=[];
			this.editable=true;
			this.container=false;
			this.textOptions=false;
			this.spellcheck=false;
			this.draggable=false;
			this.alt=null;
		}
	}
}