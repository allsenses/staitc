var range=null;
(function(){
	var p=function(){
		engine.model.tool.call(this);
		this.type="div";
		this.placeholder="Sample text...";
		this.textOptions=true;
		this.draggable=true;
	}
	var tool=function(){
		engine.add.object(new p());
	}

	var selected=null;
	var container=null;
	var object=null;
	$(window).on("edit-selection",function(event){
		var target=event.detail;
		object=target.object;
		engine.toolbox.hide();
		if(target.object.textOptions){
			range=window.getSelection().getRangeAt(0);
			container=target.$;
			toolbox();
		}
	});

	var toolbox=function(){
		engine.toolbox.show(container,[
			{icon:"bold",click:bold,active:state("bold")},
			{icon:"italic",click:italic,active:state("italic")},
			{icon:"underline",click:underline,active:state("underline")},
			{icon:"strikethrough",click:strike,active:state("strikethrough")},
			"line",
			{icon:"list-ul",click:list,active:state("insertUnorderedList")},
			{icon:"list-ol",click:numberList,active:state("insertOrderedList")},
			"line",
			{icon:"align-left",click:alignLeft,active:state("justifyLeft")},
			{icon:"align-center",click:alignCenter,active:state("justifyCenter")},
			{icon:"align-right",click:alignRight,active:state("justifyRight")},
			"line",
			{icon:"link",click:link},
			{icon:"unlink",click:unlink},
			"line",
			{icon:"undo",click:undo},
			{icon:"redo",click:redo},
			"line",
			{icon:"spell-check",click:spellcheck,active:object.spellcheck},
			"line",
			{icon:"remove-format",click:format},
			"line",
			{icon:"file-code",click:code},
		]);
	}

	var state=function(command){
		return document.queryCommandState(command);
	}

	var bold=function(){
		add({
			button:"bold",
			command:"bold",
		})
	}

	var italic=function(){
		add({
			button:"italic",
			command:"italic",
		})
	}

	var underline=function(){
		add({
			button:"underline",
			command:"underline",
		})
	}

	var strike=function(){
		add({
			button:"strikethrough",
			command:"strikeThrough"
		})
	}
	
	var list=function(){
		add({
			button:"list-ul",
			command:"insertUnorderedList",
		})
	}
	
	var numberList=function(){
		add({
			button:"list-ol",
			command:"insertOrderedList",
		})
	}

	var alignLeft=function(){
		add({
			command:"styleWithCSS",
			value:true
		})
		add({
			button:"align-left",
			command:"justifyLeft"
		})
	}

	var alignCenter=function(){
		add({
			command:"styleWithCSS",
			value:true
		})
		add({
			button:"align-center",
			command:"justifyCenter"
		})
	}

	var alignRight=function(){
		add({
			command:"styleWithCSS",
			value:true
		})
		add({
			button:"align-right",
			command:"justifyRight"
		})
	}

	var link=function(){
		selected=window.getSelection().getRangeAt(0);
		addLink();
	}

	var unlink=function(){
		add({
			command:"unlink"
		})
	}

	var undo=function(){
		add({
			command:"undo"
		})
	}

	var redo=function(){
		add({
			command:"redo"
		})
	}

	var format=function(){
		add({
			command:"removeFormat",
			value:"div"
		})
	}

	var code=function(){
		var textarea=document.createElement("textarea");
		textarea.value=container.innerHTML;
		$(textarea).on("keyup",function(){
			object.text=textarea.value;
		});
		$(textarea).on("click",function(){
			engine.toolbox.show(textarea,[
				{icon:"file-code",click:nocode,active:true}
			]);
		});
		var nocode=function(){
			engine.clear();
			engine.toolbox.hide();
		}
		engine.toolbox.show(textarea,[
			{icon:"file-code",click:engine.clear,active:true}
		]);
		container.parentNode.replaceChild(textarea,container);
	}

	var spellcheck=function(){
		if(object.spellcheck){
			object.spellcheck=false;
			$(".allsenses-editor .toolbox .spell-check").removeClass("active")
		}else{
			object.spellcheck=true;
			$(".allsenses-editor .toolbox .spell-check").addClass("active")
		}
		engine.clear();
	}
	

	var add=function(data){
		data=data || {};
		data.button=data.button || null;
		data.command=data.command || null;
		data.value=data.value || false;
		document.execCommand(data.command,false,data.value);
		toolbox();
		clear();
	}

	var clear=function(){
		var replace=[
			{tag:"b",to:"strong"},
			{tag:"i",to:"em"},
			{tag:"strike",to:"s"},
		]
		replace.forEach(function(node){
			container.querySelectorAll(node.tag).forEach(function(e){
				var tag=document.createElement(node.to);
				tag.innerHTML=e.innerHTML;
				e.parentNode.replaceChild(tag,e);
				getSelection().getRangeAt(0).selectNode(tag);
			});
		})
		object.text=container.innerHTML;
	}

	var addLink=function(){
		var input=document.createElement("input");
		input.type="text";
		input.placeholder="Adres odnośnika...";
		engine.popup.add(input,"center",function(){
			window.getSelection().addRange(selected);
			if(input.value!=""){
				add({
					command:"createlink",
					value:input.value
				});
			}
		});
	}

	engine.tools.add("fal fa-text","Text",tool);
})()