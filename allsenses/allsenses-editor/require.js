var require=function(src,callback){
	callback=callback || function(){};
	if(src.constructor===Array){
		var module=document.createElement("script");
		module.src=require.baseURL+src[0]+".min.js";
		module.type="text/javascript";
		module.async=true;
		module.addEventListener("load",function(){
			src.splice(0,1);
			if(src.length>0){
				require(src,callback);
			}
			if(src.length<=0){
				callback();
			}
		})
		require.modules.push(src[0]);
		document.body.appendChild(module)
	}
}
require.config=function(config){
	config=config || {};
	config.baseURL=config.baseURL || "";
	require.baseURL=config.baseURL;
}
require.fired=false;
require.modules=[];
require.baseURL="";
require.loaded=0;