import { engine } from "../../init.js";
import { imgCrop } from "../../modules/imgcrop.js";

(function(){
	engine.add.style(["gallery/gallery"]);
	engine.plugin.gallery={
		images:[],
		create:function(tab,obj){
			let files=obj.files;
			let callback=obj.callback || function(){};
			let remove=obj.remove || function(){};

			let div=engine.add.tab(tab).tag({
				tag:"div",
				class:"gallery-select"
			});

			for(let i=0;i<files.length;i++){
				let e=files[i];
				let img=document.createElement("div");
				img.className="img";
				img.innerHTML='<i class="fal fa-trash-alt"></i>'
				let src=e.split("/");
				let source=src[src.length-1];
				if(source=="jpg")source=src[src.length-2];
				$(img).attr("style","background-image:url(/th/xxsm/"+source+")")
				div.appendChild(img);
				img.contentId=i;
				$(img).on("click",function(){
					remove(this.contentId);
					callback();
				});
			}

			let add=document.createElement("div");
			add.className="gallery-add";
			add.innerHTML='<i class="fal fa-plus"></i>'
			div.appendChild(add);

			let popup=function(){
				let add=engine.add.popup("Select image");
				engine.plugin.gallery.images.forEach(function(e){
					let option=add.tag({
						tag:"img",
						src:"/th/xxsm/"+e,
						class:"gallery-image",
						data:e
					});
					$(option).on("click",function(){
						callback(this.getAttribute("data-obj"));
						engine.hide.popup();
					});
				});
				let label=add.tag({
					tag:"label",
					class:"input-file",
					html:'Click to upload images...'
				});
				let input=engine.model.tag({
					tag:"input",
					type:"file"
				});

				imgCrop.init(input,$(".popup form .container")[0],function(name,blob){
					console.log(blob);
					let data=new FormData();
					data.append(name,blob,name);

					let req=new XMLHttpRequest();
					$(req).on("readystatechange",function(){
						if(this.readyState==4 && this.status==200){
							engine.plugin.gallery.images=JSON.parse(this.responseText);
							engine.notification("fal fa-upload","File uploaded");
							popup();
						}
					});
					req.open("POST","/admin/pl/pl/files/ajaxadd/target/"+controller+"/target_id/"+id);
					req.send(data);
				});
				
				label.appendChild(input);
			}
			
			$(add).on("click",popup);
		},
		size:function(tab,obj){
			let files=obj.files;
			let callback=obj.callback || function(){};

			let select=engine.add.tab(tab).select("Size:",function(){
				let sources=[];
				for(let i=0;i<files.length;i++){
					let e=files[i];
					let src=e.split("/");
					let source=src[src.length-1];
					if(source=="jpg"){
						source=src[src.length-2]
					}
					src="/th/"+this.value+"/"+source;
					sources.push(src);
				}
				callback(sources);
			});
			select.addOption("Super small","xxsm");
			select.addOption("Very small","xsm");
			select.addOption("Small","sm");
			select.addOption("Medium","md");
			select.addOption("Large","lg");
			

			if(files[0]){
				let val=files[0].split("/");
				let source=val[val.length-1];
				if(source=="jpg"){
					source=val[val.length-3]
				}else{
					source=val[val.length-2];
				}
				select.value=source;
			}else{
				select.value="lg";
			}
		}
	}

	let req=new XMLHttpRequest();
	$(req).on("readystatechange",function(){
		if(this.readyState==4 && this.status==200){
			engine.plugin.gallery.images=JSON.parse(this.responseText);
		}
	});
	req.open("POST","/admin/pl/pl/files/ajaxadd/target/"+controller+"/target_id/"+id);
	req.send();
})();