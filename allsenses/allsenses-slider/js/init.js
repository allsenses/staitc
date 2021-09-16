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


const engine={
	iframe:null,
	init:function(){
		engine.iframe=$(".allsenses-slider .content iframe")[0].contentWindow;
	}
}




// data-loop="true" 
// data-center="true" 
// data-autoplay="true" 
// data-items="1" 
// data-nav="false" 
// data-dots="false" 
// data-margin="0"