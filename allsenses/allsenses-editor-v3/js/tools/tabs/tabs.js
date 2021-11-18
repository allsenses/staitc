import { engine } from "../../init.js";

(function(){
	engine.add.iframe.style("js/tools/tabs/iframe.css");
	engine.add.style(["tabs/tabs"]);
	
	var container=function(){
		engine.model.tool.call(this);
		this.module="tabs-container";
		this.type="div";
		this.editable=false;
		this.canDrag=true;
		this.content=[
			new tabs(),
			new tabsContent()
		]
	}

	var tabs=function(){
		engine.model.tool.call(this);
		this.module="tabs";
		this.type="ul";
		this.editable=false;
		this.class=["tabs"];
		this.canFocus=false;
		this.data={
			"tabs":"",
			"active-collapse":"true",
		}
		this.attr={
			"id":"collapsing-tabs"
		}
		this.content=[
			new title("Tab 1"),
			new title("Tab 2")
		];
	}

	var title=function(title){
		engine.model.tool.call(this);
		this.module="tabs-title";
		this.type="li";
		this.class=["tabs-title"];
		this.editable=false;
		this.canFocus=false;
		this.content=[
			new link(title),
		];
	}

	var link=function(title){
		engine.model.tool.call(this);
		this.module="tabs-link";
		this.type="a";
		this.editable=false;
		this.canCopy=false;
		this.canRemove=false;
		this.canFocus=false;
		this.text=title || "Tab";
		title=title.toLowerCase().split(" ").join("-");
		this.href="#"+title;
		this.placeholder="Tab title";
	}


	var tabsContent=function(){
		engine.model.tool.call(this);
		this.module="tabs-content";
		this.type="div";
		this.editable=false;
		this.canFocus=false;
		this.class=["tabs-content"];
		this.data={
			"tabs-content":"collapsing-tabs"
		};
		this.content=[
			new tabsPanel("Tab 1"),
			new tabsPanel("Tab 2")
		];
	}

	var tabsPanel=function(id){
		engine.model.tool.call(this);
		this.module="tabs-panel";
		this.type="div";
		this.editable=false;
		this.canCopy=false;
		this.canRemove=false;
		this.container=true;
		this.placeholder="Tab 1";
		this.class=["tabs-panel"];
		id=id.toLowerCase().split(" ").join("-")
		this.attr={
			"id":id
		};
	}

	


	var edit=function(){
		var target=engine.target;
		var currentTarget=engine.element;
		if(target.module=="tabs-link"){
			engine.remove.tab("properties").content();
			var label=engine.add.tab("properties").tag({
				tag:"label",
				class:"spacing-label",
				html:"Tab title:"
			});
			var input=engine.model.tag({
				tag:"input",
				type:"text",
				value:target.text
			});
			label.appendChild(input);

			$(input).on("input",function(){
				target.text=this.value;
				currentTarget.innerHTML=target.text;
			});

			var label=engine.add.tab("properties").tag({
				tag:"label",
				class:"spacing-label",
				html:"Active:"
			});

			var select=engine.model.tag({
				tag:"select"
			});
			select.addOption("Yes","true");
			select.addOption("No","false");
			label.appendChild(select);
		}
		if(target.module=="tabs-container"){
			engine.remove.tab("properties").content();
			var div=engine.add.tab("properties").tag({
				tag:"div",
				class:"text-center pb-2"
			});
			var button=engine.model.tag({
				tag:"button",
				html:'Add tab'
			});
			button.innerHTML='<i class="fal fa-plus"></i> '+button.innerHTML;
			div.appendChild(button);
			$(button).on("click",function(){
				var l=target.content[0].content.length+1;
				target.content[0].content.push(new title("Tab "+l));
				target.content[1].content.push(new tabsPanel("Tab "+l));
				engine.clear();
				edit();
			});

			var label=engine.add.tab("properties").tag({
				tag:"label",
				class:"spacing-label",
				html:"Active:"
			})
			var select=engine.model.tag({
				tag:"select",
			});
			select.addOption("","");
			label.appendChild(select);
			var l=target.content[0].content;
			var val="";
			for(var i=0;i<l.length;i++){
				var e=l[i];
				select.addOption(e.content[0].text,i);
				if(e.class.includes("is-active")){
					val=String(i);
				}
			}
			select.value=val;
			$(select).on("change",function(){
				target.content[0].content.forEach(function(e){
					e.class=["tabs-title"];
				});
				target.content[1].content.forEach(function(e){
					e.class=["tabs-panel"];
				});
				var id=this.value;
				target.content[0].content[id].class=["tabs-title","is-active"];
				target.content[1].content[id].class=["tabs-panel","is-active"];
				engine.clear();
			})

			var container=engine.add.tab("properties").tag({
				tag:"div",
				class:"tabs-manager pt-4 pb-4"
			})
			var l=target.content[0].content;
			for(var i=0;i<l.length;i++){
				var e=l[i];

				var div=engine.model.tag({
					tag:"div",
				});

				var input=engine.model.tag({
					tag:"input",
					value:e.content[0].text,
					data:String(i)
				});
				div.appendChild(input);
				
				var a=engine.model.tag({
					tag:"a",
					data:String(i)
				});
				a.innerHTML='<i class="fal fa-trash-alt"></i>';
				div.appendChild(a);

				$(a).on("click",function(){
					var data=$(this).attr("data-obj");
					target.content[0].content.splice(data,1);
					target.content[1].content.splice(data,1);
					engine.clear();
					edit();
				});

				$(input).on("change",function(){
					var val=this.value.toLowerCase().split(" ").join("-");
					var data=$(this).attr("data-obj");
					target.content[0].content[data].content[0].text=this.value;
					target.content[0].content[data].content[0].href="#"+val;
					target.content[1].content[data].attr["id"]=val;
					engine.clear();
				});

				container.appendChild(div);
			}
		}
	}


	$(window).on("engine-clear",function(){
		engine.iframe.$("[data-tabs]").foundation();
	});

	$(window).on("engine-edit",edit);


	engine.add.tab("tools").tool("Extra","fas fa-folders","Tabs",container)
})();