import { engine } from "../../init.js";

(function(){
	engine.add.style(["class/class"]);
	engine.plugin.class={
		create:function(target,reload){
			engine.add.tab("properties").tag({
				tag:"hr"
			});
			engine.add.tab("properties").tag({
				tag:"div",
				class:"text-center pb-3",
				html:'Class manager'
			})
			var container=engine.add.tab("properties").tag({
				tag:"div",
				class:"class-container"
			});
			var input=engine.model.tag({
				tag:"input",
				placeholder:"class-name"
			});
			var classList=target.class;
			if(classList.join("")=="") classList=[];
			$(input).on("keyup",function(event){
				if(event.key=="Enter"){
					var val=this.value.split(" ").join("");
					if(target.lockClass && target.lockClass.includes(val)){
						engine.notification("fas fa-exclamation","This class is reserved");
						return;
					}
					if(val=="")return;
					classList.unshift(val);
					target.class=classList;
					engine.clear();
					reload();
					engine.notification("fal fa-plus","Class added successfully");
				}
			});
			$(input).on("input",function(){
				this.value=this.value.replace(/[^a-zA-Z0-9-_]/,"");
			})
			container.appendChild(input);
			classList.forEach(function(e){
				if(target.lockClass && target.lockClass.includes(e))return;
				var div=engine.model.tag({
					tag:"div",
					class:"element",
				});
				div.innerHTML=e;
				var a=engine.model.tag({
					tag:"a",
					class:"remove",
					data:e
				});
				$(a).on("click",function(){
					classList.remove($(this).attr("data-obj"));
					target.class=classList;
					engine.clear();
					reload();
					engine.notification("fal fa-trash-alt","The class was successfully deleted");
				});
				a.innerHTML='<i class="fal fa-trash-alt"></i>';
				div.appendChild(a);

				container.appendChild(div);
			});
		}
	}
})();