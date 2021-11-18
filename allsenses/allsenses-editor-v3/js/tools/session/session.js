(function(){
	engine.add.style(["session/session"]);
	var ajax=function(data,callback,ping){
		var req=new XMLHttpRequest();
		req.open("POST", "/admin", true);
		req.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");
		if(ping){
			req.setRequestHeader("X-Requested-With","XMLHttpRequest");
		}
		req.addEventListener("readystatechange",function(){
			if(this.readyState==4 && this.status==200){
				callback(this);
			}
		})
		req.send(data);
	}

	setInterval(function(){
		ajax("",function(e){
			if(e.responseText=="false"){
				$(section).addClass("active");
				engine.notification("fal fa-exclamation-triangle","Session expired, please log in to avoid losing your data","",true);
			}
		},true);
	},4500);

	var section=document.createElement("section");
	section.className="logout-container hide";
	var form=document.createElement("form");
	
	form.innerHTML='<div class="loading"></div><div class="input-group"><span class="input-group-label"><i class="fas fa-user"></i></span><input type="text" name="username" id="username" value="" placeholder="Login" class="input-group-field"></div><div class="input-group"><span class="input-group-label"><i class="fas fa-lock"></i></span><input type="password" name="password" id="password" value="" placeholder="Hasło" class="input-group-field"></div><div class="text-right"><button class="button">Zaloguj się</button></div>';
	section.appendChild(form);

	document.body.appendChild(section);

	$(form).on("submit",function(){
		var user=form.querySelector("#username").value;
		var pass=form.querySelector("#password").value;
		engine.notification("fal fa-signal-stream","Connecting to server...","",true);
		$(section.querySelector(".loading")).addClass("active");
		ajax("username="+user+"&password="+pass,function(e){
				ajax("",function(e){
					if(e.responseText!="false"){
						$(section.querySelector(".loading")).removeClass("active");
						$(section).removeClass("active");
						engine.notification("fal fa-exclamation-triangle","Logged in");
						setTimeout(function(){
							form.querySelector("#username").value="";
							form.querySelector("#password").value="";
						},500);
					}else{
						engine.notification("fal fa-exclamation-triangle","Wrong login or password");
						$(section.querySelector(".loading")).removeClass("active");
						form.querySelector("#username").value="";
						form.querySelector("#password").value="";
					}
				},true);
		},false);
		return false;
	});
})();