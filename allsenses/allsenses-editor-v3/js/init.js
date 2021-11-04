import { Back } from "./modules/goback.js";
import { lang } from "./modules/lang.js";
import { Tag } from "./modules/tag.js";
import { Laptop, Mobile, Tablet } from "./modules/preview.js";



const engine={
	directory:"",
	plugin:{},
	settings:{
		group:{}
	},
	target:null,
	element:null,
	iframe:null,
	slide:0,
	data:[],
	draggable:null,
	beforeCallback:null,
	init:function(container,tools){
		var editor=new Tag("div");
		editor.className="engine";
		editor.innerHTML='<div class="panel active"><div class="options"></div><div class="tools"></div><div class="bar"></div><a class="panel-switch active"><i class="fal fa-angle-right"></i></a></div><div class="content active"></div><div class="popup"><form></form></div>';
		$(container).append(editor);
		var iframeElem=new Tag("iframe");
		iframeElem.width="100%";
		iframeElem.height="100%";
		$(".engine .content").append(iframeElem);
		
		engine.iframe=$(".engine .content iframe")[0].contentWindow;
		
		let iframe=$(".engine .content iframe");
		iframe.on("load",function(){
			engine.add.iframe.style("css/app.css");
			engine.add.iframe.style("css/fontawesome/css/all.min.css");
			engine.add.iframe.style("css/slider.css");
			engine.add.iframe.style("/templates/default/css/style.css",true);
			engine.add.iframe.script("js/jquery.js",function(){
				engine.iframe.$("body").on("click",function(event){
					engine.iframe.$("[data-active]").attr("data-active","false");
					engine.target=null;
					engine.element=null;
					engine.show.panel.option("tools");
				});
			});
		});
		engine.iframe.location.reload();
		iframe[0].src="";
		
		$(".engine .panel-switch").on("click",function(){
			$(this).toggleClass("active");
			$(".engine .panel").toggleClass("active");
			$(".engine .content").toggleClass("active");
		});
		
		engine.add.panel.option("fal fa-puzzle-piece","tools",true);
		
		engine.add.panel.option("fal fa-cogs","properties",false);

		engine.add.bar("fal fa-arrow-left",Back);
		engine.add.bar("fal fa-laptop",Laptop);
		engine.add.bar("fal fa-tablet",Tablet);
		engine.add.bar("fal fa-mobile",Mobile);
		
		var notification=new Tag("div");
		notification.className="notification";
		editor.appendChild(notification);

		var load=new Tag("div");
		load.className="load active";
		load.innerHTML='<div class="progress"></div><img class="logo" src="'+engine.directory+'logo.svg">';
		editor.appendChild(load);

		$(window).on("engine-clear",function(){
			$(".fa-pause.green").removeClass("fa-pause").addClass("fa-play");
		})

		engine.load.tools(tools,function(loaded){
			var progress=loaded/tools.length*100;
			$(".load .progress").attr("style","width:"+progress+"%");
			if(loaded==tools.length){
				setTimeout(function(){
					let event=new Event("engine-loaded");
					window.dispatchEvent(event);
					$(".load").removeClass("active");
				},100)
			}
		});

		$(window).on("keydown",function(event){
			if(event.key=="Escape"){
				engine.hide.popup();
			}
		});
	},

	load:{
		tools:function(tools,progress,loaded){
			let modules=Object.assign([],tools);
			if(modules.length!=0){
				progress=progress || function(){};
				loaded=loaded || 0;
				let e=modules[0];
				let script=new Tag("script");
				script.type="module";
				script.src=engine.directory+"js/tools/"+e+"/"+e+".js";
				$(script).on("load",function(){
					loaded++;
					progress(loaded);
					modules.splice(0,1);
					engine.load.tools(modules,progress,loaded);
				});
				document.body.appendChild(script);
			}
		}
	},

	save:function(){
		localStorage.setItem("allsenses-editor",JSON.stringify(engine.settings));
	},
	
	
	clear:function(){
		engine.iframe.document.body.innerHTML="";
		engine.render(engine.data,engine.iframe.document.body);

		var event=new Event("engine-clear");
		window.dispatchEvent(event);
	},

	edit:function(target,element){
		engine.remove.tab("properties").content(true);
		engine.target=target;
		engine.element=element;
		var event=new Event("engine-edit");
		window.dispatchEvent(event);
	},
	
	render:function(data,container,parentObj){
		let id=0;
		data.forEach(function(e){
			e.id=id++;
			e.parent=data;
			e.parentObj=parentObj;
			var obj=document.createElement(e.type);
			obj.engineTarget=e;
			obj.className=e.class;
			obj.alt=e.alt;
			obj.src=e.src;
			obj.textOptions=e.textOptions;
			obj.contentEditable=e.editable;
			obj.spellcheck=e.spellcheck;
			obj.style.cssText=e.style;
			obj.innerHTML=e.text;
			if(e.href){
				obj.addEventListener("click",function(event){
					event.preventDefault();
					return false;
				},true);
				obj.href=e.href;
			}
			if(e==engine.target){
				$(obj).attr("data-active","true");
			}
			if(!e.container && e.editable){
				$(obj)[0].addEventListener("paste",function(event){
					event.preventDefault();
					var text=event.clipboardData.getData("text/plain");
					document.execCommand("insertHTML",false,text);
				},false);
				$(obj).on("keyup",function(event){
					this.engineTarget.text=this.innerHTML;
				});
			}
			if(e.textOptions){
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

			$(obj).attr("data-placeholder",e.placeholder);
			$(obj).attr("data-container",e.container);

			var l=Object.keys(e.data);
			for(var i=0;i<l.length;i++){
				$(obj).attr("data-"+l[i],e.data[l[i]]);
			}

			var l=Object.keys(e.attr || {});
			for(var i=0;i<l.length;i++){
				$(obj).attr(l[i],e.attr[l[i]]);
			}
			
			if(e.canFocus){
				$(obj).on("click",function(){
					engine.edit(e,obj);
				});
				$(obj).on("mouseover",function(event){
					event.stopPropagation();
					$("[data-hover]").attr("data-hover","false");
					$(this).attr("data-hover","true");
				});
				$(obj).on("mouseout",function(event){
					$(this).attr("data-hover","false");
				});
				$(obj).on("click",function(){
					$("[data-active]").attr("data-active","false");
					$(this).attr("data-active","true");
				});
				obj.addEventListener("dragover",function(){
					$("[data-hover]").attr("data-hover","false");
					$(this).attr("data-hover","true");
				},true);
				obj.addEventListener("dragleave",function(){
					$("[data-hover]").attr("data-hover","false");
				},true);
			}


			// Container drop section
			var parent=null;
			if(e.container)parent=e;
			if(e.parentObj && e.parentObj.container){
				parent=e;
				engine.drop(e,e.parent,e.id,container);
			}
			engine.render(e.content,obj,parent);

			if(e.container){
				engine.drop(e,e.content,e.content.length,obj);
			}

			
			$(container).append(obj);
		});

		if(engine.data==data){
			var drop=new Tag("div","add-main");
			drop.innerHTML='<i class="far fa-plus"></i>';
			$(drop).on("drop",function(event){
				engine.add.content(engine.data);
				$(this).removeClass("active");
			});
			$(drop).on("dragover",function(event){
				$(this).addClass("active");
				event.preventDefault();
			});
			$(drop).on("dragleave",function(){
				$(this).removeClass("active");
			});
			engine.iframe.document.body.append(drop);
		}
	},

	drop:function(e,content,id,container){
		var div=new Tag("a");
		div.className="add";
		if(content.length==0){
			div.className="add visible"
		};
		div.innerHTML='<i class="far fa-plus"></i>';
		div.engineTarget=e;
		div.setAttribute("data-id",id);
		$(div).on("drop",function(){
			engine.add.content(content,id);
			$(this).removeClass("active");
		})
		$(div).on("dragover",function(event){
			event.preventDefault();
			$(this).addClass("active");
		});
		$(div).on("dragleave",function(event){
			$(this).removeClass("active");
		});
		$(container)[0].appendChild(div);
	},

	preview:function(){
		if($(this).find("i").hasClass("fa-play")){
			$(this).find("i").removeClass("fa-play");
			$(this).find("i").addClass("fa-pause");
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
		}else{
			$(this).find("i").removeClass("fa-pause");
			$(this).find("i").addClass("fa-play");
			engine.clear();
			view.slides();
		}
	},


	get:{
		JSON:function(){
			return engine.data;
		},
		HTML:function(data,container){
			data=data || engine.data;
			if(data==engine.data){
				container=new Tag("div");
				container.className="main-slider owl-carousel owl-theme";
			}
			data.forEach(function(e){
				if(e.type=="slide"){
					var obj=new Tag("div");
					obj.className="item";
					$(obj).attr("style","background-image:url("+e.background+")");
				}else{
					var obj=new Tag(e.type);
					obj.className=e.class.join(" ");
					obj.innerHTML=e.text;
					obj.src=e.src;
				}
				
				engine.get.HTML(e.content,obj);
				container.appendChild(obj);
			});
			if(data==engine.data){
				let script='<script>$(window).on("load",function(){$(".owl-carousel").owlCarousel({loop:'+engine.settings.loop+',autoplay:'+engine.settings.autoplay+',animateOut:"'+engine.settings.animateOut+'",margin:'+engine.settings.margin+',nav:'+engine.settings.nav+',dots:'+engine.settings.dots+',items:'+engine.settings.items+',center:'+engine.settings.center+',autoplayTimeout:'+engine.settings.autoplayTimeout+'});});</script>';
				return container.outerHTML+script;
			}
		}
	},

	hide:{
		popup:function(){
			$(".popup").removeClass("active");
			$(".panel").attr("style","");
			$(".content").attr("style","");
		}
	},

	show:{
		panel:{
			option:function(name){
				$(".engine .panel [data-tab]").removeClass("active");
				$('.engine .panel [data-tab="'+name+'"]').addClass("active");
			}
		}
	},
	
	remove:{
		tab:function(tabName){
			var self={};
			self.target=$('.engine .panel [data-tab="'+tabName+'"]');
			
			self.content=function(active){
				self.target.html("");
				if(active){
					$('.engine .panel [data-tab]').removeClass("active");
					self.target.addClass("active")
				}
			}
			
			return self;
		}
	},
	
	add:{
		style:function(sources){
			let style=new Tag("style");
			for(let i=0;i<sources.length;i++){
				style.innerHTML+='@import url("'+engine.directory+'js/tools/'+sources[i]+'.css");\n';
			}
			document.head.appendChild(style);
		},
		iframe:{
			script:function(src,callback){
				var script=new Tag("script");
				script.src=engine.directory+src;
				engine.iframe.document.head.appendChild(script);
				$(script).on("load",callback);
			},
			style:function(src,nodir){
				nodir=nodir || false;
				var link=new Tag("link");
				link.rel="stylesheet";
				if(nodir){
					link.href=src;
				}else{
					link.href=engine.directory+src;
				}
				engine.iframe.document.head.appendChild(link);
			}
		},
		panel:{
			option:function(icon,name,active,click){
				icon=icon || "fal fa-cogs";
				name=name || "Name";
				active=active || false;
				var a=new Tag("a");
				a.innerHTML='<i class="'+icon+'"></i>';
				var div=new Tag("div");
				if(active) div.className="active";
				div.setAttribute("data-tab",name);
				$(a).on("click",function(){
					$(".engine .panel [data-tab]").removeClass("active");
					$(div).addClass("active");
				});
				$(a).on("click",click);
				$(".engine .panel .options").append(a);
				$(".engine .panel").append(div);
				return div;
			}
		},

		popup:function(title){
			let self={};
			$(".popup").addClass("active");
			$(".popup form").html('<div class="title">'+title+'</div>');
			$(".panel").attr("style","-webkit-filter:blur(4px)");
			$(".content").attr("style","-webkit-filter:blur(4px)");
			let target=new Tag("div");
			target.className="container";
			$(".popup form").append(target);
			self.tag=function(obj){
				let tag=engine.model.tag(obj);
				target.append(tag);
				return tag;
			}

			return self;
		},
		
		tab:function(tabName){
			var self={};
			self.target=$('.engine .panel [data-tab="'+tabName+'"]');
			self.tool=function(type,icon,name,dragClass,beforeCallback){
				if(typeof(engine.settings.group[type])=="undefined"){
					engine.settings.group[type]=true;
				}
				icon=icon || "fal fa-tools";
				name=lang.translate(name) || "";
				type=lang.translate(type) || "Extra";
				dragClass=dragClass || {};

				var a=new Tag("a");
				a.className="tool";
				a.innerHTML='<i class="'+icon+'"></i>'+name;
				a.draggable=true;
				$(a).on("drag",function(){
					engine.draggable=dragClass;
					engine.beforeCallback=beforeCallback || null;
				});

				if($(self.target).find('[data-type="'+type+'"')[0]){
					$(self.target).find('[data-type="'+type+'"')[0].append(a)
				}else{
					let div=new Tag("div");
					if(engine.settings.group[type]) $(div).addClass("active");
					div.setAttribute("data-type",type);
					div.append(a);
					var a=new Tag("a");
					a.className="tools-type";
					if(engine.settings.group[type]) $(a).addClass("active");
					a.innerHTML=type;
					$(a).on("click",function(){
						$(self.target).find('[data-type="'+type+'"]').toggleClass("active");
						$(this).toggleClass("active");
						engine.settings.group[type]=this.classList.contains("active");
						engine.save();
					});
					self.target.append(a);
					self.target.append(div);
				}
				return a;
			}

			self.input=function(title,type,value,change){
				let tag=engine.model.input(title,type,value,change);
				self.target.append(tag.label);
				return tag.input;
			}

			self.checkbox=function(title,change){
				let tag=engine.model.checkbox(title,change);
				self.target.append(tag.label);
				return tag.input;
			}


			self.select=function(title,change){
				let tag=engine.model.select(title,change);
				self.target.append(tag.label);
				return tag.select;

			}

			self.button=function(title,click){
				let tag=engine.model.button(title,click);
				self.target.append(tag.div);
				return tag.button;
			}

			self.tag=function(obj){
				let tag=engine.model.tag(obj);
				self.target.append(tag);
				return tag;
			}
			
			return self;
		},

		bar:function(icon,click){
			icon=icon || "fal fa-cog";
			click=click || null;
			var a=new Tag("a");
			a.innerHTML='<i class="'+icon+'"></i>';
			$(a).on("click",click);
			$(".engine .panel .bar").append(a);
		},
		
		content:function(parent,id){
			if(engine.beforeCallback){
				if(engine.draggable.constructor==Object){
					var target=engine.draggable;
				}else{
					var target=new engine.draggable();
				}
				if(typeof(id)=="number"){
					parent.insert(id,target);
				}else{
					parent.push(target);
				}
				engine.beforeCallback(target);
				engine.beforeCallback=null;
			}else{
				if(engine.draggable){
					try{
						if(typeof(id)=="number"){
							parent.insert(id,new engine.draggable());
						}else{
							parent.push(new engine.draggable());
						}
					}catch(err){
						console.log(err);
						var target=engine.draggable;
						target.parent.splice(target.id,1);
						if(typeof(id)=="number"){
							if(engine.draggable.parent==parent && engine.draggable.id<id)id--;
							parent.insert(id,engine.draggable);
						}else{
							parent.push(engine.draggable);
						}
					}
					engine.draggable=null;
				}
			}
			engine.show.panel.option("tools")
			//engine.toolbox.hide();
			engine.clear();
			var event=new Event("engine-add");
			window.dispatchEvent(event);
		},
	},
	notification:function(icon,text,strong,stop){
		icon=icon || "";
		text=lang.translate(text) || "";
		strong=lang.translate(strong) || "";
		stop=stop || false;
		text=text || "";

		$(".engine .notification").html("");
		var div=new Tag("div");
		$(div).html('<i class="'+icon+'"></i><span>'+text+' <strong>'+strong+'</strong></span>');
		$(".engine .notification")[0].appendChild(div);
		$(".engine .notification").addClass("active");
		clearTimeout(this.timeout);
		this.timeout=setTimeout(function(){
			$(".engine .notification").removeClass("active");
		},5000);
		if(stop){clearTimeout(this.timeout)}
	},

	model:{
		// Old versions compatibility
		tool:function(){
			this.type="h1";
			this.lockClass=[];
			this.class=[];
			this.text="";
			this.src="";
			this.module="test";
			this.placeholder="";
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
		},

		tag:function(obj){
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
				var tag=new Tag("label");
				tag.innerHTML=obj.html;
				var input=new Tag("input");
				input.type="checkbox";
				input.checked=obj.checked || false;
				tag.appendChild(input);
				var i=new Tag("i");
				tag.appendChild(i);
				$(tag).attr("data-obj",obj.data);
				self.target.append(tag);
				return tag;
			}else{
				var tag=new Tag(obj.tag);
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
				return tag;
			}
		},

		select:function(title,change){
			change=change || null;
			var select=new Tag("select");
			select.addOption=function(name,value){
				name=lang.translate(name);
				this.innerHTML+='<option value="'+value+'">'+name+'</option>';
			}
			$(select).on("change",change);
			var label=new Tag("label");
			label.innerHTML=lang.translate(title);
			label.appendChild(select);

			return {label,select};
		},

		input:function(title,type,value,change){
			var input=new Tag("input");
			input.type=type;
			input.value=value;
			$(input).on("change",change);

			var label=new Tag("label");
			label.innerHTML=lang.translate(title);
			label.appendChild(input);

			return {label,input};
		},

		checkbox:function(title,change){
			change=change || null;
			let label=new Tag("label","checkbox");
			label.innerHTML=lang.translate(title);
			let input=new Tag("input");
			input.type="checkbox";
			let span=new Tag("span");

			$(input).on("change",change);

			label.append(input);
			label.append(span);

			return {label,input};
		},

		button:function(title,click){
			var div=new Tag("div");
			div.className="text-center";
			var button=new Tag("a");
			button.className="button";
			button.innerHTML=lang.translate(title);
			$(button).on("click",click);
			div.appendChild(button);

			return {div,button};
		}
	}
}

Array.prototype.remove=function(value){
	if(this.includes(value)){
		return this.splice(this.indexOf(value),1);
	}
	return false;
}

Array.prototype.insert = function ( index, item ) {
    this.splice( index, 0, item );
};

String.prototype.toBoolean=function(){
	if(this=="true" || this==true || this=="1" || this==1) return true;
	return false;
}

export {engine};

window.engine=engine;

// data-loop="true" 
// data-center="true" 
// data-autoplay="true" 
// data-items="1" 
// data-nav="false" 
// data-dots="false" 
// data-margin="0"