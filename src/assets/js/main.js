/*  $(document).ready(function(){
    alert("SCROLL1");
    cartH=$(".cart-menu").height();
    headerH=$(".header-menu").height();
}); */

$(window).on("scroll", function () {
    var cartH=$(".cart-menu").height();
    var headerH=$(".header-menu").height();
	var e = $(window).scrollTop() / (headerH + cartH);
    
	e < 1 ? $(".header-menu .img-logo-store").css({
		transform: "scale(" + (1 - e) + ")",
		opacity: 1 - e
	}) : $(".header-menu .img-logo-store").css({
		transform: "scale(1)",
		opacity: "1"
	})

     var op = $('.img-logo-store').css('opacity');
     var math = Math.round(op);
     console.log('op:' + op + ',' + math);
	if (op == 1 && math == 1) {
        $(".hide-menu").css({display: "block"});
        $(".display-menu").css({display: "none"});
    }
    else if(math == 0){
        $(".hide-menu").css({display: "block"});
        $(".display-menu").css({display: "none"});
        
	} else if (math == 1) {
        $(".hide-menu").css({display: "none"});
        $(".display-menu").css({display: "block"});
    }
});