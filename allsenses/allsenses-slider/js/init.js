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
import { Laptop, Mobile, Tablet } from "./modules/preview.js";

const view={
	slides:function(){
		engine.remove.tab("slides").content();

		if(engine.data[engine.slide]){
			var input=engine.add.tab("slides").input("Slide title:","text",engine.data[engine.slide].name);
			$(input).on("input",function(){
				engine.data[engine.slide].name=this.value;
			});
	
			var input=engine.add.tab("slides").input("Background:","text",engine.data[engine.slide].background);
			$(input).on("change",function(){
				engine.data[engine.slide].background=this.value;
				engine.clear();
			});
		};

		engine.add.tab("slides").button("Add slide",function(){
			engine.data.push({
				type:"slide",
				name:"Slide#"+engine.data.length,
				background:"",
				content:[]
			});
			view.slides();
		});
		let i=0;
		engine.data.forEach(function(e){
			let j=i;
			engine.add.tab("slides").slide(e.name,function(){
				engine.slide=j;
				engine.clear();
				view.slides();
			},function(){
				engine.data.splice(j,1);
				view.slides();
				if(j==engine.slide) engine.clear();
			})
			i++;
		})
	},

	settings:function(){
		engine.remove.tab("settings").content();
		let add=engine.add.tab("settings");
		var select=add.select("Loop:",function(){
			engine.settings.loop=this.value.toBoolean();
		});
		select.addOption("Yes","true");
		select.addOption("No","false");
		select.value=engine.settings.loop;

		var select=add.select("Autoplay:",function(){
			engine.settings.autoplay=eval(this.value);
		});
		select.addOption("Yes","true");
		select.addOption("No","false");
		select.value=engine.settings.autoplay;

		var select=add.select("Animation:",function(){
			engine.settings.animateOut=this.value;
		});
		select.addOption("Fade","fadeOut");
		select.addOption("Slide","");
		select.value=engine.settings.animateOut;

		var input=add.input("Animation speed:","number",engine.settings.autoplayTimeout);
		$(input).on("change",function(){
			engine.settings.autoplayTimeout=Number(this.value);
		});
	}
}

const engine={
	plugin:{},
	settings:{
		loop:true,
		autoplay:true,
		animateOut:"fadeOut",
		margin:0,
		nav:false,
		dots:false,
		items:1,
		center:true,
		autoplayTimeout:2000
		
	},
	target:null,
	element:null,
	iframe:null,
	slide:0,
	data:[],
	init:function(container,tools){
		var editor=document.createElement("div");
		editor.className="allsenses-slider";
		editor.innerHTML='<div class="panel active"><div class="options"></div><div class="tools"></div><div class="bar"></div><a class="panel-switch active"><i class="fal fa-angle-right"></i></a></div><div class="content active"></div>';
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
			engine.add.iframe.script("js/jquery.js",function(){
				engine.add.iframe.script("js/owl/owl.carousel.min.js");
				engine.iframe.$("body").on("click",function(event){
					engine.iframe.$("[data-active]").attr("data-active","false");
					engine.target=null;
					engine.element=null;
				})
			});
		});
		engine.iframe.location.reload();
		iframe[0].src="";
		

		$(".allsenses-slider .panel-switch").on("click",function(){
			$(this).toggleClass("active");
			$(".allsenses-slider .panel").toggleClass("active");
			$(".allsenses-slider .content").toggleClass("active");
		});
		
		engine.add.panel.option("fal fa-puzzle-piece","tools",true);
		engine.add.panel.option("fal fa-presentation","slides",false,view.slides);
		engine.add.panel.option("fal fa-cog","settings",false,view.settings);
		engine.add.panel.option("fal fa-sliders-h","properties",false);

		engine.add.bar("fal fa-arrow-left");
		engine.add.bar("fal fa-laptop",Laptop);
		engine.add.bar("fal fa-tablet",Tablet);
		engine.add.bar("fal fa-mobile",Mobile);
		engine.add.bar("fas fa-play green",engine.preview);
		
		var notification=document.createElement("div");
		notification.className="notification";
		editor.appendChild(notification);

		var load=document.createElement("div");
		load.className="load active";
		load.innerHTML='<div class="progress"></div><img class="logo" src="logo.svg">';
		editor.appendChild(load);

		engine.load.tools(tools,function(loaded){
			var progress=loaded/tools.length*100;
			$(".load .progress").attr("style","width:"+progress+"%");
			if(loaded==tools.length){
				setTimeout(function(){
					$(".load").removeClass("active");
				},100)
			}
		});
	},

	load:{
		tools:function(tools,progress){
			progress=progress || function(){};
			var loaded=0;
			tools.forEach(function(e){
				var script=document.createElement("script");
				script.type="module";
				script.src="js/tools/"+e+"/"+e+".js";
				$(script).on("load",function(){
					loaded++;
					progress(loaded)
				});
				document.body.appendChild(script);
			});
		}
	},
	
	
	clear:function(){
		if(engine.data[engine.slide]){
			var slide=engine.data[engine.slide];
			engine.iframe.document.body.innerHTML="";
			var container=document.createElement("div");
			container.className="main-slider";
			var div=document.createElement("div");
			div.className="item";
			container.appendChild(div);
			$(div).attr("style","background-image:url("+slide.background+")");
			engine.render(engine.data[engine.slide].content,div);
			engine.iframe.document.body.appendChild(container);
	
			var event=new Event("engine-clear");
			window.dispatchEvent(event);
		}else{
			engine.iframe.document.body.innerHTML="";
		}
	},

	edit:function(target,element){
		engine.remove.tab("properties").content(true);
		engine.target=target;
		engine.element=element;
		var event=new Event("engine-edit");
		window.dispatchEvent(event);
	},
	
	render:function(data,container){
		data=data || engine.data[engine.slide].content;
		let id=0;
		data.forEach(function(e){
			e.id=id++;
			var obj=document.createElement(e.type);
			obj.className=e.class.join(" ");
			obj.innerHTML=e.text;
			obj.src=e.src;
			obj.contentEditable=e.editable || false;
			if(e.editable){
				$(obj).on("input",function(){
					e.text=this.innerText;
				});
			}
			if(e.canFocus){
				$(obj).on("click",function(event){
					event.stopPropagation();
					engine.edit(e,obj);
				});
				$(obj).on("mouseover",function(event){
					event.stopPropagation();
					engine.iframe.$("[data-hover]").attr("data-hover","false");
					$(this).attr("data-hover","true");
				});
				$(obj).on("mouseout",function(event){
					$(this).attr("data-hover","false");
				});
				$(obj).on("click",function(){
					engine.iframe.$("[data-active]").attr("data-active","false");
					$(this).attr("data-active","true");
				});
			}
			engine.render(e.content,obj);
			
			$(container).append(obj);
		});
	},

	preview:function(){
		engine.iframe.document.body.innerHTML=engine.get.HTML();
		engine.iframe.$(".owl-carousel").owlCarousel({
			loop:engine.settings.loop,
			autoplay:engine.settings.autoplay,
			animateOut:engine.settings.animateOut,
			margin:engine.settings.margin,
			nav:engine.settings.nav,
			dots:engine.settings.dots,
			items:engine.settings.items,
			center:engine.settings.center,
			autoplayTimeout:engine.settings.autoplayTimeout
		});
	},


	get:{
		JSON:function(){

		},
		HTML:function(data,container){
			data=data || engine.data;
			if(data==engine.data){
				container=document.createElement("div");
				container.className="main-slider owl-carousel owl-theme";
			}
			data.forEach(function(e){
				if(e.type=="slide"){
					var obj=document.createElement("div");
					obj.className="item";
					$(obj).attr("style","background-image:url("+e.background+")");
				}else{
					var obj=document.createElement(e.type);
					obj.className=e.class.join(" ");
					obj.innerHTML=e.text;
					obj.src=e.src;
				}
				
				engine.get.HTML(e.content,obj);
				container.appendChild(obj);
			});
			if(data==engine.data){
				return container.outerHTML;
			}
		}
	},
	
	remove:{
		tab:function(tabName){
			var self={};
			self.target=$('.allsenses-slider .panel [data-tab="'+tabName+'"]');
			
			self.content=function(active){
				self.target.html("");
				if(active){
					$('.allsenses-slider .panel [data-tab]').removeClass("active");
					self.target.addClass("active")
				}
			}
			
			return self;
		}
	},
	
	add:{
		style:function(sources){
			var style=document.createElement("style");
			for(var i=0;i<sources.length;i++){
				style.innerHTML+='@import url("tools/'+sources[i]+'.css");\n';
			}
			document.head.appendChild(style);
		},
		iframe:{
			script:function(src,callback){
				var script=document.createElement("script");
				script.src=src;
				engine.iframe.document.head.appendChild(script);
				$(script).on("load",callback);
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

			self.input=function(title,type,value,change){
				var input=document.createElement("input");
				input.type=type;
				input.value=value;
				$(input).on("change",change);

				var label=document.createElement("label");
				label.innerHTML=lang.translate(title);
				label.appendChild(input);

				$(self.target).append(label);
				return input;
			}


			self.select=function(title,change){
				change=change || null;
				var select=document.createElement("select");
				select.addOption=function(name,value){
					name=lang.translate(name);
					this.innerHTML+='<option value="'+value+'">'+name+'</option>';
				}
				$(select).on("change",change);
				var label=document.createElement("label");
				label.innerHTML=lang.translate(title);
				label.appendChild(select);

				$(self.target).append(label);
				return select;

			}

			self.button=function(title,click){
				var div=document.createElement("div");
				div.className="text-center";
				var button=document.createElement("a");
				button.className="button";
				button.innerHTML=lang.translate(title);
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

		bar:function(icon,click){
			icon=icon || "fal fa-cog";
			click=click || null;
			var a=document.createElement("a");
			a.innerHTML='<i class="'+icon+'"></i>';
			$(a).on("click",click);
			$(".allsenses-slider .panel .bar").append(a);
		},
		
		content:function(instance){
			if(!engine.data[engine.slide]) return false;
			engine.data[engine.slide].content=[];
			engine.data[engine.slide].content.push(instance);
			engine.clear();
		},
	},
	notification:function(icon,text,strong,stop){
		icon=icon || "";
		text=lang.translate(text) || "";
		strong=lang.translate(strong) || "";
		stop=stop || false;
		text=text || "";

		$(".allsenses-slider .notification").html("");
		var div=document.createElement("div");
		$(div).html('<i class="'+icon+'"></i><span>'+text+' <strong>'+strong+'</strong></span>');
		$(".allsenses-slider .notification")[0].appendChild(div);
		$(".allsenses-slider .notification").addClass("active");
		clearTimeout(this.timeout);
		this.timeout=setTimeout(function(){
			$(".allsenses-slider .notification").removeClass("active");
		},5000);
		if(stop){clearTimeout(this.timeout)}
	},

	model:{
		tool:class{
			constructor(){
				this.module="model";
				this.type="h1";
				this.lockClass=[];
				this.class=[];
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

Array.prototype.remove=function(value){
	if(this.includes(value)){
		return this.splice(this.indexOf(value),1);
	}
	return false;
}

String.prototype.toBoolean=function(){
	if(this=="true" || this==true || this=="1" || this==1) return true;
	return false;
}

export {engine};



// data-loop="true" 
// data-center="true" 
// data-autoplay="true" 
// data-items="1" 
// data-nav="false" 
// data-dots="false" 
// data-margin="0"