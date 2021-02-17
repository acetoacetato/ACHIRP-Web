(function($) {
  
  "use strict";  

  $(window).on('load', function() {

  /*Page Loader active
    ========================================================*/
    $('#preloader').fadeOut();

  // Sticky Nav
    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 200) {
            $('.scrolling-navbar').addClass('top-nav-collapse');
        } else {
            $('.scrolling-navbar').removeClass('top-nav-collapse');
        }
    });

    /* ==========================================================================
       countdown timer
       ========================================================================== */
    

    /* Auto Close Responsive Navbar on Click
    ========================================================*/
    function close_toggle() {
        if ($(window).width() <= 768) {
            $('.navbar-collapse a').on('click', function () {
                $('.navbar-collapse').collapse('hide');
            });
        }
        else {
            $('.navbar .navbar-inverse a').off('click');
        }
    }
    close_toggle();
    $(window).resize(close_toggle);

      /* WOW Scroll Spy
    ========================================================*/
     var wow = new WOW({
      //disabled for mobile
        mobile: false
    });
    wow.init();

    

    /* Back Top Link active
    ========================================================*/
      var offset = 200;
      var duration = 500;
      $(window).scroll(function() {
        if ($(this).scrollTop() > offset) {
          $('.back-to-top').fadeIn(400);
        } else {
          $('.back-to-top').fadeOut(400);
        }
      });

      $('.back-to-top').on('click',function(event) {
        event.preventDefault();
        $('html, body').animate({
          scrollTop: 0
        }, 600);
        return false;
      });
      siguientePagina();
      siguientePaginaNoti();

      $(window).scroll(function() {
        $('.lazy-load').each(function() {
            if ( $(this).attr('data-lazy') && $(this).offset().top < ($(window).scrollTop() + $(window).height() + 100) ) {
                var method = $(this).data('lazy');
                eval(method + "()");
                $(this).removeAttr('data-lazy');
            }
        });

        $('.lazy-section').each(function (){
          if ( $(this).attr('data-ruta') && $(this).offset().top < ($(window).scrollTop() + $(window).height() +100) ) {
            var ruta = $(this).data('ruta');
            var id = $(this).data('id');
            var obj = $(this)
            fetch(ruta).then(res => {
              
              if(res.ok){
                return res.text();
              }
            }).then( string =>{

              document.getElementById(id).innerHTML = string;
              $('#' + id).fadeIn(10000);
            }).catch(e => { console.error(e) })
            obj.removeAttr('data-ruta');
            obj.removeAttr('data-id');
            obj.removeClass('lazy-section')
          }

        })
    })
  });      

}(jQuery));