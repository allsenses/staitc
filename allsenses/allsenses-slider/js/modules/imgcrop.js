// Allsenses Image Crop tool only for Allsenses

export const imgCrop={
	canvas:null,
	img:null,
	fomrat:null,
	name:null,
	cutted:document.createElement("canvas"),
	init:function(input,container,callback){
		input.addEventListener("change",function(){
			let file=this.files[0];
			imgCrop.fomrat=file.type;
			imgCrop.name=file.name;
			let reader=new FileReader();
			reader.addEventListener("load",function(event){
				let blob=new Blob([event.target.result]);
				let url=URL.createObjectURL(blob);
				let img=new Image();
				img.src=url;
				img.addEventListener("load",function(){
					this.w=this.width;
					this.h=this.height;
					imgCrop.img=this;
					imgCrop.create(container,callback);

					let c=imgCrop.cutted;
					c.ctx=c.getContext("2d");
				})
			});
			reader.readAsArrayBuffer(file);
		})
	},

	create:function(container,callback){
		var img=imgCrop.img;
		let div=document.createElement("div");
		div.className="text-center";
		if(imgCrop.canvas){
			var c=imgCrop.canvas;
		}else{
			var c=imgCrop.canvas=document.createElement("canvas");
		}
		c.ctx=c.getContext("2d");
		c.className="img-crop";
		c.w=c.width=img.w;
		c.h=c.height=img.h;
		c.ctx.translate(.5,.5);
		c.ctx.clearRect(0,0,c.w,c.h);
		c.ctx.drawImage(img,0,0)
		container.innerHTML="";
		div.appendChild(c);

		let a=document.createElement("a");
		a.className="img-crop-button button";
		a.innerHTML="Cut";
		a.addEventListener("click",function(){
			imgCrop.cutted.toBlob(function(blob){
				let url=URL.createObjectURL(blob);
				let img=new Image();
				img.src=url;
				img.addEventListener("load",function(){
					imgCrop.canvas=null;
					container.innerHTML="";
					imgCrop.img=this;
					callback(imgCrop.name,blob);
				})
			},imgCrop.fomrat,1);
		})
		div.appendChild(a);
		container.appendChild(div);

		let collision=function(obj1,obj2){
			let x1=obj1.x-obj1.w/2;
			let y1=obj1.y-obj1.h/2;
			let x2=obj2.x-obj2.w/2;
			let y2=obj2.y-obj2.h/2;
			if (x1 < x2 + obj2.w &&
				x1 + obj1.w > x2 &&
				y1 < y2 + obj2.h &&
				y1 + obj1.h > y2) {
				return true;
			}else{
				return false;
			}
		}

		let box2=function(obj1,obj2){
			if (obj1.x < obj2.x + obj2.w &&
				obj1.x + obj1.w > obj2.x &&
				obj1.y < obj2.y + obj2.h &&
				obj1.y + obj1.h > obj2.y) {
				return true;
			}else{
				return false;
			}
		}

		let pointStart={x:0,y:0,w:6,h:6};
		let pointEnd={x:0,y:0,w:6,h:6};
		let action={
			draw:false,
			drag:false,
			resize:false,
			move:{
				is:false,
				x:0,
				y:0
			}
		};
		c.addEventListener("mousedown",function(event){
			let rect=c.getBoundingClientRect();
			let offsetX=rect.left;
			let offsetY=rect.top;
			let scaleX=c.w/rect.width;
			let scaleY=c.h/rect.height;
			let x=(event.clientX-offsetX)*scaleX;
			let y=(event.clientY-offsetY)*scaleY;
			let w=pointEnd.x-pointStart.x;
			let h=pointEnd.y-pointStart.y;
			if(collision(pointStart,{x:x,y:y,w:48,h:48})){
				action.drag=pointStart;
			}else
			if(collision(pointEnd,{x:x,y:y,w:48,h:48})){
				action.drag=pointEnd;
			}else
			if(collision({x:pointStart.x+w/2,y:pointStart.y,w:pointStart.w,h:pointStart.h},{x:x,y:y,w:48,h:48})){
				action.resize=pointStart;
			}else
			if(collision({x:pointStart.x+w,y:pointStart.y+h/2,w:pointStart.w,h:pointStart.h},{x:x,y:y,w:48,h:48})){
				action.resize=pointEnd;
			}else 
			if(box2({x:pointStart.x,y:pointStart.y,w:w,h:h},{x:x,y:y,w:1,h:1})){
				action.move.is=true;
				action.move.x=x;
				action.move.y=y;
			}else{
				action.draw=true;
				pointStart.x=x;
				pointStart.y=y;
				pointEnd.x=x;
				pointEnd.y=y;
			}
			update();
		});

		c.addEventListener("mousemove",function(event){
			let rect=c.getBoundingClientRect();
			let img=imgCrop.img;
			let offsetX=rect.left;
			let offsetY=rect.top;
			let scaleX=c.w/rect.width;
			let scaleY=c.h/rect.height;
			let x=(event.clientX-offsetX)*scaleX;
			let y=(event.clientY-offsetY)*scaleY;
			let w=pointEnd.x-pointStart.x;
			let h=pointEnd.y-pointStart.y;
			if(action.move.is){
				let offsetX=(action.move.x-x)*-1;
				let offsetY=(action.move.y-y)*-1;
				let resizeX=true;
				let resizeY=true;
				if(pointStart.x+offsetX<0 || pointEnd.x+offsetX>img.w){
					resizeX=false;
				} 
				if(pointStart.y+offsetY<0 || pointEnd.y+offsetY>img.h){
					resizeY=false;
				}
				if(resizeX){
					pointStart.x+=offsetX;
					pointEnd.x+=offsetX;
				}
				if(resizeY){
					pointStart.y+=offsetY;
					pointEnd.y+=offsetY;
				}
				action.move.x=x;
				action.move.y=y;
				update();
			}
			if(action.drag){
				action.drag.x=x;
				action.drag.y=y;
				update();
			}
			if(action.resize){
				if(action.resize==pointStart){
					action.resize.y=y;
				}else{
					action.resize.x=x;
				}
				update();
			}
			if(action.draw){
				pointEnd.x=x;
				pointEnd.y=y;
				update();
			}
			if(collision(pointStart,{x:x,y:y,w:48,h:48})){
				c.style.cursor="nw-resize";
			}else
			if(collision(pointEnd,{x:x,y:y,w:48,h:48})){
				c.style.cursor="se-resize";
			}else
			if(collision({x:pointStart.x+w/2,y:pointStart.y,w:pointStart.w,h:pointStart.h},{x:x,y:y,w:48,h:48},{x:x,y:y,w:48,h:48})){
				c.style.cursor="n-resize";
			}else
			if(collision({x:pointStart.x+w,y:pointStart.y+h/2,w:pointStart.w,h:pointStart.h},{x:x,y:y,w:48,h:48},{x:x,y:y,w:48,h:48})){
				c.style.cursor="w-resize";
			}else 
			if(box2({x:pointStart.x,y:pointStart.y,w:w,h:h},{x:x,y:y,w:1,h:1})){
				c.style.cursor="move";
			}else{
				c.style.cursor="auto";
			}
		});

		c.addEventListener("mouseup",leave);
		c.addEventListener("mouseleave",leave)
		c.addEventListener("dblclick",function(){
			let img=imgCrop.img;
			pointStart.x=0;
			pointStart.y=0;
			pointEnd.x=img.w;
			pointEnd.y=img.h;
			update();
		})

		function leave(event){
			action.draw=false;
			action.drag=false;
			action.resize=false;
			action.move.is=false;
			if(pointStart.x>pointEnd.x){
				let x1=pointStart.x;
				let x2=pointEnd.x;
				pointStart.x=x2;
				pointEnd.x=x1;
				update();
			}
			if(pointStart.y>pointEnd.y){
				let y1=pointStart.y;
				let y2=pointEnd.y;
				pointStart.y=y2;
				pointEnd.y=y1;
				update();
			}
		}

		let update=function(){
			let img=imgCrop.img;
			let c=imgCrop.canvas;
			c.ctx.clearRect(0,0,c.w,c.h);
			c.ctx.save();
			c.ctx.drawImage(img,0,0);
			c.ctx.fillStyle="rgba(0,0,0,.6)";
			c.ctx.fillRect(0,0,c.w,c.h);
			c.ctx.restore();

			var w=pointEnd.x-pointStart.x;
			var h=pointEnd.y-pointStart.y;
			c.ctx.drawImage(img,pointStart.x,pointStart.y,w,h,pointStart.x,pointStart.y,w,h);

			imgCrop.cutted.width=w;
			imgCrop.cutted.height=h;
			imgCrop.cutted.ctx.drawImage(img,pointStart.x,pointStart.y,w,h,0,0,w,h);

			c.ctx.strokeStyle="#ddd";
			c.ctx.lineWidth=1;
			c.ctx.setLineDash([5,5]);
			c.ctx.strokeRect(pointStart.x-1,pointStart.y-1,w+1,h+1);

			c.ctx.fillStyle="#ddd";
			c.ctx.fillRect(pointStart.x-pointStart.w/2,pointStart.y-pointStart.h/2,pointStart.w,pointStart.h);
			c.ctx.fillRect(pointEnd.x-pointEnd.w/2,pointEnd.y-pointEnd.h/2,pointEnd.w,pointEnd.h);
			

			c.ctx.fillRect(pointStart.x-pointStart.w/2+w/2,pointStart.y-pointStart.h/2,pointStart.w,pointStart.h);

			c.ctx.fillRect(pointStart.x-pointStart.w/2+w,pointStart.y-pointStart.h/2+h/2,pointStart.w,pointStart.h);


			c.ctx.fillStyle="rgba(255,255,255,.4)";
			c.ctx.fillRect(pointStart.x+w/3,pointStart.y,1,h);
			c.ctx.fillRect(pointStart.x+(w/3*2),pointStart.y,1,h);
			c.ctx.fillRect(pointStart.x,pointStart.y+(h/3),w,1);
			c.ctx.fillRect(pointStart.x,pointStart.y+(h/3*2),w,1);
		}
	}
}