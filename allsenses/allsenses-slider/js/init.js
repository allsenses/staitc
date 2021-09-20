// $(window).on("load",function(){
// 	document.querySelectorAll(".owl-carousel").forEach(function(e){
// 		if($(e).attr("data-loop")){
// 			$(e).owlCarousel({
// 				loop:eval($(e).attr("data-loop")),
// 				autoplay:eval($(e).attr("data-autoplay")),
// 				animateOut:$(e).attr("data-animateout"),
// 				margin:Number($(e).attr("data-margin")),
// 				nav:eval($(e).attr("data-nav")),
// 				dots:eval($(e).attr("data-dots")),
// 				items:Number($(e).attr("data-items")),
// 				center:eval($(e).attr("data-center")),
// 				autoplaySpeed:Number($(e).attr("data-autoplayspeed")),
// 			});
// 		}
// 	});
// })

import { lang } from "./modules/lang.js";

const helper={
	slides:function(){
		engine.remove.tab("slides").content();
		engine.add.tab("slides").button("Add slide",function(){
			engine.data.push({
				type:"slide",
				name:"Slide#"+engine.data.length,
				background:"",
				content:[]
			});
			helper.slides();
		});
		let i=0;
		engine.data.forEach(function(e){
			let j=i;
			engine.add.tab("slides").slide(e.name,function(){
				engine.slide=j;
				engine.clear();
			},function(){
				engine.data.splice(j,1);
				helper.slides();
				if(j==engine.slide) engine.clear();
			})
			i++;
		})
	},
	slide_settings:function(){
		engine.remove.tab("slide-settings").content();
		if(!engine.data[engine.slide]) return false;
		var input=engine.add.tab("slide-settings").input("Slide title:","text",engine.data[engine.slide].name);
		$(input).on("input",function(){
			engine.data[engine.slide].name=this.value;
		});
		var input=engine.add.tab("slide-settings").input("Background:","text",engine.data[engine.slide].background);
		$(input).on("change",function(){
			engine.data[engine.slide].background=this.value;
			engine.clear();
		});
	}
}

const engine={
	iframe:null,
	slide:0,
	data:[
		{
			type:"slide",
			name:"First",
			background:"back.webp",
			content:[
				{type:"h1",text:"Sample text",editable:true,class:"fade-right",content:[]},
				{type:"h2",text:"Sample text",editable:true,class:"fade-right",content:[]}
			]
		},
		{
			type:"slide",
			name:"Second",
			background:"back.png",
			content:[
				{type:"div",text:"",editable:true,class:"fade-right",content:[
					{type:"div",text:"",editable:true,class:"fade-right",content:[]}
				]},
			]
		}
	],
	init:function(container,tools){
		var editor=document.createElement("div");
		editor.className="allsenses-slider";
		editor.innerHTML='<div class="panel active"><div class="options"></div><div class="tools"></div><div class="properties"></div></div><div class="content active"></div>';
		$(container).append(editor);
		var iframeElem=document.createElement("iframe");
		iframeElem.width="100%";
		iframeElem.height="100%";
		$(".allsenses-slider .content").append(iframeElem);
		
		engine.iframe=$(".allsenses-slider .content iframe")[0].contentWindow;
		
		let iframe=$(".allsenses-slider .content iframe");
		iframe.on("load",function(){
			engine.add.iframe.style("js/owl/owl.carousel.min.css");
			engine.add.iframe.style("js/owl/owl.theme.default.min.css");
			engine.add.iframe.style("css/app.css");
			engine.add.iframe.style("css/fontawesome/css/all.min.css");
			engine.add.iframe.style("css/slider.css");
			engine.add.iframe.script("js/jquery.js");
			engine.clear();
		});
		engine.iframe.location.reload();
		iframe[0].src="";
		
		
		engine.add.panel.option("fal fa-puzzle-piece","tools",true);
		engine.add.panel.option("fal fa-presentation","slides",false,helper.slides);
		engine.add.panel.option("fal fa-cogs","slide-settings",false,helper.slide_settings);
		
		engine.load.tools(tools);
	},

	load:{
		tools:function(tools,callback){
			callback=callback || function(){};
			var loaded=0;
			tools.forEach(function(e){
				var script=document.createElement("script");
				script.type="module";
				script.src="js/tools/"+e+"/"+e+".js";
				$(script).on("load",function(){
					loaded++;
					if(loaded==tools.length){
						callback();
					}
				});
				document.body.appendChild(script);
			});
		}
	},
	
	
	clear:function(){
		if(engine.data[engine.slide]){
			var slide=engine.data[engine.slide];
			engine.iframe.document.body.innerHTML="";
			var div=document.createElement("div");
			div.className="item";
			$(div).attr("style","background-image:url("+slide.background+")");
			engine.render(engine.data[engine.slide].content,div);
			engine.iframe.document.body.appendChild(div);
	
			var event=new Event("engine-clear");
			window.dispatchEvent(event);
		}else{
			engine.iframe.document.body.innerHTML="";
		}
	},
	
	container:null,
	render:function(data,container){
		data=data || engine.data[engine.slide].content;
		let id=0;
		data.forEach(function(e){
			e.id=id++;
			var obj=document.createElement(e.type);
			obj.className=e.class
			obj.innerHTML=e.text;
			obj.src=e.src;
			obj.contentEditable=e.editable || false;
			if(e.editable){
				$(obj).on("input",function(){
					e.text=this.innerText;
				});
			}
			engine.render(e.content,obj);
			
			$(container).append(obj);
		});
	},
	
	remove:{
		tab:function(tabName){
			var self={};
			self.target=$('.allsenses-slider .panel [data-tab="'+tabName+'"]');
			
			self.content=function(){
				self.target.html("");
			}
			
			return self;
		}
	},
	
	add:{
		iframe:{
			script:function(src){
				var script=document.createElement("script");
				script.src=src;
				engine.iframe.document.head.appendChild(script);
			},
			style:function(src){
				var link=document.createElement("link");
				link.rel="stylesheet";
				link.href=src;
				engine.iframe.document.head.appendChild(link);
			}
		},
		panel:{
			option:function(icon,name,active,click){
				icon=icon || "fal fa-cogs";
				name=name || "Name";
				active=active || false;
				var a=document.createElement("a");
				a.innerHTML='<i class="'+icon+'"></i>';
				var div=document.createElement("div");
				if(active) div.className="active";
				div.setAttribute("data-tab",name);
				$(a).on("click",function(){
					$(".allsenses-slider .panel [data-tab]").removeClass("active");
					$(div).addClass("active");
				});
				$(a).on("click",click);
				$(".allsenses-slider .panel .options").append(a);
				$(".allsenses-slider .panel").append(div);
				return div;
			}
		},
		
		tab:function(tabName){
			var self={};
			self.target=$('.allsenses-slider .panel [data-tab="'+tabName+'"]');
			self.tool=function(icon,name,className){
				var a=document.createElement("a");
				a.className="tool";
				a.innerHTML='<i class="'+icon+'"></i>'+name;
				$(a).on("click",function(){
					engine.add.content(new className());
				});
				self.target.append(a);
				return a;
			}
			
			self.slide=function(title,click,removeCallback){
				var div=document.createElement("div");
				div.className="slide";
				div.innerHTML=title;
				var remove=document.createElement("a");
				remove.className="remove";
				remove.innerHTML='<i class="fal fa-trash-alt"></i>';
				$(remove).on("click",removeCallback);
				div.appendChild(remove);
				$(div).on("click",click);
				self.target.append(div);
			},

			self.input=function(title,type,value){
				var input=document.createElement("input");
				input.type=type;
				input.value=value;

				var label=document.createElement("label");
				label.innerHTML=lang.translate(title);
				label.appendChild(input);

				$(self.target).append(label);
				return input;
			}

			self.button=function(title,click){
				var div=document.createElement("div");
				div.className="text-center";
				var button=document.createElement("a");
				button.className="button";
				button.innerHTML=title;
				$(button).on("click",click);
				div.appendChild(button)
				self.target.append(div);
				return button;
			}

			self.tag=function(obj){
				obj=obj || {};
				obj.tag=obj.tag || "input";
				obj.type=obj.type || "";
				obj.value=obj.value || null;
				obj.html=lang.translate(obj.html) || "";
				obj.placeholder=obj.placeholder || "";
				obj.src=obj.src || "";
				obj.class=obj.class || "";
				obj.data=obj.data || "";
				obj.disabled=obj.disabled || false;
				if(obj.tag=="checkbox"){
					var tag=document.createElement("label");
					tag.innerHTML=obj.html;
					var input=document.createElement("input");
					input.type="checkbox";
					input.checked=obj.checked || false;
					tag.appendChild(input);
					var i=document.createElement("i");
					tag.appendChild(i);
					$(tag).attr("data-obj",obj.data);
					self.target.append(tag);
					return tag;
				}else{
					var tag=document.createElement(obj.tag);
					if(obj.tag=="select"){
						tag.addOption=function(name,value){
							name=lang.translate(name);
							this.innerHTML+='<option value="'+value+'">'+name+'</option>';
						}
					}
					tag.disabled=obj.disabled;
					tag.type=obj.type;
					tag.value=obj.value;
					tag.innerHTML=obj.html;
					tag.placeholder=obj.placeholder;
					tag.className=obj.class;
					tag.src=obj.src;
					$(tag).attr("data-obj",obj.data);
					self.target.append(tag);
					return tag;
				}
			}
			
			return self;
		},
		
		content:function(instance){
			engine.data[engine.slide].content=[];
			engine.data[engine.slide].content.push(instance);
			engine.clear();
		}
	},
	model:{
		tool:class{
			constructor(){
				this.module="model";
				this.type="h1";
				this.lockClass=[];
				this.class="";
				this.text="";
				this.src="";
				this.placeholder="Sample text";
				this.content=[];
				this.editable=true;
				this.container=false;
				this.textOptions=false;
				this.spellcheck=null;
				this.alt="";
				this.canDrag=false;
				this.canRemove=true;
				this.canFocus=true;
				this.style="";
				this.href="";
				this.data={};
				this.attr={};
			}
		}
	}
}

export {engine};



// data-loop="true" 
// data-center="true" 
// data-autoplay="true" 
// data-items="1" 
// data-nav="false" 
// data-dots="false" 
// data-margin="0"