(function(){

	var text=function(text){
		engine.model.tool.call(this);
		engine.plugin.spacing.model.call(this);
		this.type="div";
		this.module="text";
		this.editable=true;
		this.textOptions=true;
		this.placeholder="Sample text...";
		this.canDrag=true;
		this.text=text || "";
	}


	var edit=function(){
		var target=engine.target;
		if(target.module=="text"){
			engine.remove.tab("properties").content();
			range=window.getSelection().getRangeAt(0);
			toolbox();
			engine.plugin.spacing.create(target,edit);
		}
	}

	var range=null;
	$(window).on("engine-edit",edit);


	var toolbox=function(){
		var target=engine.target;
		engine.toolbox.show([
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
			{icon:"spell-check",click:spellcheck,active:target.spellcheck},
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

	var add=function(data){
		data=data || {};
		data.button=data.button || null;
		data.command=data.command || null;
		data.value=data.value || false;
		document.execCommand(data.command,false,data.value);
		toolbox();
		clear();
	}


	var link=function(){
		var selected=window.getSelection().getRangeAt(0);
		var form=engine.popup.create("Link address");
		var input=document.createElement("input");
		input.type="text";
		input.placeholder="Link address";
		var input=engine.popup.add({
			tag:"input",
			type:"text",
			placeholder:"URL..."
		});
		$(form).on("submit",function(event){
			// var val=String(input);
			// this.removeChild(input);
			window.getSelection().addRange(selected);
			if(input.value.split(" ").join("")!=""){
				var target=engine.target;
				document.execCommand("createlink",false,input.value);
				target.text=engine.edit.currentTarget.innerHTML;
			}
		});
		engine.popup.add({
			tag:"input",
			type:"submit",
			value:"Add link"
		});
	}


	var code=function(){
		var target=engine.target;
		var currentTarget=engine.edit.currentTarget;

		var textarea=document.createElement("textarea");
		textarea.value=currentTarget.innerHTML;
		$(textarea).on("keyup",function(){
			target.text=textarea.value;
		});
		var nocode=function(){
			engine.clear();
			engine.toolbox.hide();
		}
		$(textarea).on("click",function(event){
			event.stopPropagation();
			engine.edit.currentTarget=this;
			engine.toolbox.show([
				{icon:"file-code",click:nocode,active:true}
			]);
		});
		engine.toolbox.show([
			{icon:"file-code",click:nocode,active:true}
		]);
		currentTarget.parentNode.replaceChild(textarea,currentTarget);
		var h=textarea.scrollHeight;
		$(textarea).attr("style","height:"+h+"px")
	}

	var spellcheck=function(){
		var target=engine.target;
		if(target.spellcheck){
			target.spellcheck=false;
			$(".allsenses-editor .toolbox .spell-check").removeClass("active");
		}else{
			target.spellcheck=true;
			$(".allsenses-editor .toolbox .spell-check").addClass("active");
		}
		engine.clear();
	}

	var clear=function(){
		var replace=[
			{tag:"b",to:"strong"},
			{tag:"i",to:"em"},
			{tag:"strike",to:"s"},
		];
		replace.forEach(function(node){
			engine.edit.currentTarget.querySelectorAll(node.tag).forEach(function(e){
				var tag=document.createElement(node.to);
				tag.innerHTML=e.innerHTML;
				e.parentNode.replaceChild(tag,e);
				getSelection().getRangeAt(0).selectNode(tag);
			});
		})
		engine.edit.target.text=engine.edit.currentTarget.innerHTML;
	}


	engine.add.tab("tools").tool("Basic","fal fa-text","Text",text);
})()