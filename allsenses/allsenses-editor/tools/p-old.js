(function(){
	var p=function(){
		engine.model.tool.call(this);
		this.type="p";
		this.class="text-left";
		this.placeholder="Sample text...";
	}
	var tool=function(){
		engine.add.object(new p());
	}

	$(window).on("edit-selection",function(event){
		var target=event.detail;
		var selection=window.getSelection();
		engine.toolbox.hide();
		if($(".allsenses-editor .selection").length>0){
			$(".allsenses-editor .selection")[0].outerHTML=$(".allsenses-editor .selection")[0].innerHTML;
		}
		if(target.object.type=="p" && selection.toString()!=""){
			var range=selection.getRangeAt(0);
			var span=document.createElement("span");
			span.className="selection";
			span.appendChild(range.cloneContents());
			range.deleteContents();
			range.insertNode(span);
			clear(target.object,target.$);
			engine.toolbox.show(target.$,[
				{icon:"bold",click:function(){bold(target.object,target.$,range.commonAncestorContainer)}},
				{icon:"italic",click:function(){italic(target.object,target.$,range.commonAncestorContainer)}},
				{icon:"underline",click:function(){underline(target.object,target.$,range.commonAncestorContainer)}},
				{icon:"link",click:function(){link(target.object,target.$,range.commonAncestorContainer)}}
			]);
			check("strong","bold");
			check("em","italic");
			check("u","underline");
		}
		target.object.text=$(target.$).html();
	});

	var check=function(tag,name){
		var tagname=$(".allsenses-editor .selection")[0].parentNode.tagName.toLowerCase();
		if($(".allsenses-editor .selection")[0].innerHTML.search("<"+tag+">")!=-1 || tagname==tag){
			$(".allsenses-editor .toolbox ."+name).addClass("active");
		}else{
			$(".allsenses-editor .toolbox ."+name).removeClass("active");
		}
	}

	var clear=function(target,object){
		$(object)[0].innerHTML=$(object)[0].innerHTML.replace(/<[^/>][^>]*><\/[^>]+>/,"");
		target.text=$(object).html();
	}

	var add=function(target,object,container,type,href){
		var tagname=$(".allsenses-editor .selection")[0].parentNode.tagName.toLowerCase();
		if($(".allsenses-editor .selection")[0].innerHTML.search('<'+type+'>')==-1 && tagname!=type){
			console.log(type,tagname);
			var selection=$(".allsenses-editor .selection")[0].innerText;
			if(type=="a"){
				$(".allsenses-editor .selection")[0].innerHTML='<'+type+' href="'+href+'">'+selection+'</'+type+'>';
			}else{
				$(".allsenses-editor .selection")[0].innerHTML='<'+type+'>'+selection+'</'+type+'>';
			}
		}else{
			if(tagname==type){
				var selection=$(".allsenses-editor .selection")[0].innerText;
				var test=container.innerHTML.toString();
				test=test.replace('<span class=\"selection\">','</'+type+'>').replace('</span>','<'+type+'>');
				window.test=test;
				container.innerHTML=test;
			}else{
				var selection=$(".allsenses-editor .selection")[0].innerText;
				$(".allsenses-editor .selection")[0].innerHTML=selection;
			}
		}
		check("strong","bold");
		check("em","italic");
		check("u","underline");
		check("a","link");
		clear(target,object);
	}

	var bold=function(target,object,container){
		add(target,object,container,"strong");
	}
	var italic=function(target,object,container){
		add(target,object,container,"em");
	}
	var underline=function(target,object,container){
		add(target,object,container,"u");
	}
	var link=function(target,object,container){
		var input=document.createElement("input");
		input.type="text";
		input.placeholder="Adres odnośnika...";
		engine.popup.add(input,"center",function(){
			add(target,object,container,"a",input.value);
		});
	}

	engine.tools.add("text","Text",tool);
})()