import { engine } from "../../init.js";

(function(){
	engine.add.style(["notification/notification"]);

	var div=document.createElement("div");
	div.className="notification";
	$(".engine")[0].appendChild(div);
	
	engine.notification=function(icon,text,strong,stop){
		icon=icon || "";
		text=lang.translate(text) || "";
		strong=lang.translate(strong) || "";
		stop=stop || false;
		text=text || "";

		$(".allsenses-editor .notification").html("");
		var div=document.createElement("div");
		$(div).html('<i class="'+icon+'"></i><span>'+text+' <strong>'+strong+'</strong></span>');
		$(".allsenses-editor .notification")[0].appendChild(div);
		$(".allsenses-editor .notification").addClass("active");
		clearTimeout(this.timeout);
		this.timeout=setTimeout(function(){
			$(".allsenses-editor .notification").removeClass("active");
		},5000);
		if(stop){clearTimeout(this.timeout)}
	}
})();