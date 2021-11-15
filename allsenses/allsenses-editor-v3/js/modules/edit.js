import { engine } from "../init.js";

export function edit(target,element){
	engine.remove.tab("properties").content(true);
	engine.target=target;
	engine.element=element;
	let event=new Event("engine-edit");
	window.dispatchEvent(event);

	let editBar=engine.iframe.$(".edit");
	editBar.addClass("active");
	engine.iframe.$(".edit a").addClass("active");
	if(target.href.search("#")==-1) event.stopPropagation();
	if(!target.canRemove){
		engine.iframe.$(".edit .remove").removeClass("active");
		engine.iframe.$(".edit .clone").removeClass("active");
	}
	if(!target.canDrag){
		engine.iframe.$(".edit .drag").removeClass("active");
	}
	
	let rect=element.getBoundingClientRect();
	let container=engine.iframe;
	let edit=editBar[0].getBoundingClientRect();
	let x=rect.left+rect.width-edit.width-16;
	let y=container.scrollY+rect.top-edit.height;
	if(y<0){
		y=container.scrollY+rect.height+rect.top;
	}

	editBar.attr("style","left:"+x+"px;top:"+y+"px");
}

edit.hide=function(event){
	engine.iframe.$(".edit").removeClass("active");
	engine.iframe.$("[data-active]").attr("data-active","false");
	engine.target=null;
	engine.element=null;
	engine.remove.tab("properties").content();
	engine.show.panel.option("tools");
}

edit.remove=function(event){
	var target=engine.target;
	if(target.canRemove){
		event.stopPropagation();
		var event=new Event("engine-add");
		window.dispatchEvent(event);
		target.parent.splice(target.id,1);
		engine.remove.tab("properties").content();
		engine.show.panel.option("tools");
		edit.hide();
		engine.clear();
	}
}

edit.drag=function(event){
	engine.iframe.$(".add").addClass("draggable");
	$(engine.element).attr("data-disabled","true");
	engine.draggable=engine.target;
}

edit.up=function(event){
	event.stopPropagation();
	var target=engine.target;
	var ev=new Event("engine-move");
	window.dispatchEvent(ev);
	if(target.id-1>=0){
		var prev=target.parent[target.id-1];
		target.parent[target.id-1]=target;
		target.parent[target.id]=prev;
		target.id--;
		engine.clear();
	}
}

edit.down=function(event){
	event.stopPropagation();
	var target=engine.target;
	var ev=new Event("engine-move");
	window.dispatchEvent(ev);
	if(target.parent.length>target.id+1){
		var next=target.parent[target.id+1];
		target.parent[target.id+1]=target;
		target.parent[target.id]=next;
		target++;
		engine.clear();
	}
}

edit.clone=function(event){
	var target=engine.target.parent;
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
	
	let clone=removeCyclic(engine.target.parent)[engine.target.id];
	target.insert(engine.target.id,JSON.parse(JSON.stringify(clone)));
	edit.hide();
	engine.clear();
}