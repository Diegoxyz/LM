/*Percentuale di scroll*/
$(window).scroll(function(){

    var winTop = $(window).scrollTop();
    var winHeight = $(window).height();
    var docHeight = $(document).height();
    var getScroll=  (winTop / (docHeight-winHeight));
    var scrollLimit = 0.25;
      /*@see layout.component.css*/
    var border = $('#scroll-top-btn').css('border');

    if (border && border.indexOf('1px') >=0) {
        /*small screen*/
        scrollLimit = 0.10;
      } else if (border && border.indexOf('2px') >=0) {
        /*medium screen*/
        scrollLimit = 0.20;
      }

    /* this.console.log(getScroll); */

    if  (getScroll > scrollLimit) {
        $(".scroll-to-top").fadeIn(600)
        $('.scroll-to-top').attr('style', 'display:block;');
    } else {
        $(".scroll-to-top").fadeOut(600);
        $('.scroll-to-top').attr('style', 'display:none;');
    }
});

$(window).resize(function() {
  try{
    var zoom;
    zoom = (( window.outerWidth - 10 ) / window.innerWidth) *100;
	zoom = Math.ceil(zoom);
  } catch (error){
		console.log("ERROR---> " + error);
  } 

  if (zoom <= 34) {
    $(".flex-item").css({"min-width": "10%"});
  } else if (zoom > 34  && zoom <= 67) {
    $(".flex-item").css({"min-width": "15%"});
  } else if (zoom > 67 && zoom <= 100) {
    $(".flex-item").css({"min-width": "20%"});
    //alert('compreso tra 67 e 100');
  } else if (zoom >=100 ){
    $(".flex-item").css({"min-width": "25%"});
    //alert('zoom >100');
  }else {
    $(".flex-item").css({"min-width": "25%"});
  }
});


