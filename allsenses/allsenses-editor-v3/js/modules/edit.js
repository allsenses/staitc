export const edit={
	target:null,
	currentTarget:null,
	show:function(event){
		var editBar=$(".allsenses-editor .container .edit");
		editBar.addClass("active");
		engine.edit.target=event.currentTarget.engineTarget;
		engine.edit.currentTarget=event.currentTarget;
		
		$(".allsenses-editor .edit a").addClass("active");
		var target=engine.edit.target;
		if(target.href.search("#")==-1) event.stopPropagation();
		if(!target.canRemove){
			$(".allsenses-editor .edit .remove").removeClass("active");
			$(".allsenses-editor .edit .clone").removeClass("active");
		}
		if(!target.canDrag){
			$(".allsenses-editor .edit .drag").removeClass("active");
		}


		var container=$(".allsenses-editor .container")[0];
		var scroll=$(".allsenses-editor .container")[0].getBoundingClientRect();
		var rect=engine.edit.currentTarget.getBoundingClientRect();
		var edit=editBar[0].getBoundingClientRect();

		var x=container.scrollLeft+rect.left-scroll.left+rect.width-edit.width-16;
		var y=container.scrollTop+rect.top-scroll.top-edit.height;
		if(y<0){
			y=container.scrollTop+rect.height+rect.top;
		}
		if(x<0){
			x=0
		}
		editBar.attr("style","left:"+x+"px;top:"+y+"px");
		
		
		var titleBar=$(".allsenses-editor .container .title");
		titleBar.addClass("active");
		titleBar.html(target.module);
		var title=titleBar[0].getBoundingClientRect();
		var x=container.scrollLeft+rect.left-scroll.left-title.width+title.width;
		var y=container.scrollTop+rect.top-scroll.top;
		if(y<0){
			y=container.scrollTop+rect.height+rect.top;
		}
		if(x<0){
			x=0
		}
		titleBar.attr("style","left:"+x+"px;top:"+y+"px");

		engine.properties.clear();
		engine.toolbox.hide();
		var event=new Event("engine-edit");
		engine.properties.show();
		window.dispatchEvent(event);
	},

	hide:function(){
		$(".allsenses-editor .container .edit").removeClass("active");
		$(".allsenses-editor .container .title").removeClass("active");
		$("[data-active]").attr("data-active","false");
		engine.edit.target=null;
		engine.edit.currentTarget=null;
		engine.tools.show();
		engine.properties.clear();
	},


	drag:function(event){
		$(".add").addClass("draggable");
		$(engine.edit.currentTarget).attr("data-disabled","true");
		engine.draggable=engine.edit.target;
	},

	remove:function(event){
		var target=engine.edit.target;
		if(target.canRemove){
			event.stopPropagation();
			var event=new Event("engine-add");
			window.dispatchEvent(event);
			target.parent.splice(target.id,1);
			engine.properties.clear();
			engine.tools.show();
			engine.edit.hide();
			engine.clear();
		}
	},

	up:function(event){
		event.stopPropagation();
		var target=engine.edit.target;
		var ev=new Event("engine-move");
		window.dispatchEvent(ev);
		if(target.id-1>=0){
			var prev=target.parent[target.id-1];
			target.parent[target.id-1]=target;
			target.parent[target.id]=prev;
			target.id--;
			engine.clear();
		}
	},
	down:function(event){
		event.stopPropagation();
		var target=engine.edit.target;
		var ev=new Event("engine-move");
		window.dispatchEvent(ev);
		if(target.parent.length>target.id+1){
			var next=target.parent[target.id+1];
			target.parent[target.id+1]=target;
			target.parent[target.id]=next;
			target++;
			engine.clear();
		}
	},
	clone:function(event){
		var target=engine.edit.target.parent;
		var removeCyclic=function(data){
			data=data;
			data.forEach(function(e){
				delete e.parent;
				delete e.parentObj;
				removeCyclic(e.content);
			});
			if(data==target){
				return target;
			}
		}
		
		var clone=removeCyclic(engine.edit.target.parent)[engine.edit.target.id];
		
		target.insert(engine.edit.target.id,JSON.parse(JSON.stringify(clone)));
		engine.clear();
	}
}