$(window).on("load",function(){
	document.querySelectorAll(".owl-carousel").forEach(function(e){
		if($(e).attr("data-loop")){
			$(e).owlCarousel({
				loop:eval($(e).attr("data-loop")),
				autoplay:eval($(e).attr("data-autoplay")),
				animateOut:$(e).attr("data-animateout"),
				margin:Number($(e).attr("data-margin")),
				nav:eval($(e).attr("data-nav")),
				dots:eval($(e).attr("data-dots")),
				items:Number($(e).attr("data-items")),
				center:eval($(e).attr("data-center")),
				autoplaySpeed:Number($(e).attr("data-autoplayspeed")),
			});
		}
	});

	engine.init();
})


const helper={
	slides:function(){
		engine.remove.tab("slides").content();
		let i=0;
		engine.data.forEach(function(e){
			let j=i;
			engine.add.tab("slides").slide(e.name,function(){
				engine.slide=j;
				engine.clear();
			})
			i++;
		})
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
	init:function(){
		engine.iframe=$(".allsenses-slider .content iframe")[0].contentWindow;

		let iframe=$(".allsenses-slider .content iframe");
		iframe[0].src="";
		engine.iframe.location.reload();
		iframe.on("load",function(){
			engine.add.iframe.style("js/owl/owl.carousel.min.css");
			engine.add.iframe.style("js/owl/owl.theme.default.min.css");
			engine.add.iframe.style("css/app.css");
			engine.add.iframe.style("css/fontawesome/css/all.min.css");
			engine.add.iframe.style("css/slider.css");
			engine.add.iframe.script("js/jquery.js");
			engine.clear();
		})

		engine.add.panel.option("fal fa-puzzle-piece","tools",true);
		engine.add.panel.option("fal fa-cogs","slides",false,helper.slides);

		engine.add.tab("tools").tool("fal fa-table","Test",function(){});
	},


	clear:function(){
		var slide=engine.data[engine.slide];
		engine.iframe.document.body.innerHTML="";
		var div=document.createElement("div");
		div.className="item";
		$(div).attr("style","background-image:url("+slide.background+")");
		engine.render(engine.data[engine.slide].content,div);
		engine.iframe.document.body.appendChild(div);
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
			self.tool=function(icon,name,click){
				var a=document.createElement("a");
				a.className="tool";
				a.innerHTML='<i class="'+icon+'"></i>'+name;
				$(a).on("click",click);
				self.target.append(a);
			}

			self.slide=function(title,click){
				var div=document.createElement("div");
				div.className="slide";
				div.innerHTML=title;
				var remove=document.createElement("a");
				remove.className="remove";
				remove.innerHTML='<i class="fal fa-trash-alt"></i>';
				div.appendChild(remove);
				$(div).on("click",click);
				self.target.append(div);
			}

			return self;
		},

		content:function(className){
			engine.data[engine.slide].content=[];
			engine.data[engine.slide].content.push(new className);
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