(function($) {
  'use strict';

  function dateFormat(datestr) {
    var date = new Date(datestr);
    return date.format('yyyy-MM-dd');
  }

  function slickInit() {
    var $peopleTalk = $('.quote-texts-list'),
        $people = $('.create-item');
    $peopleTalk.slick({
      autoplay: true,
      pauseOnHover: true,
      speed: 1000,
      autoplaySpeed: 3000,
      slidesToShow: 1,
      draggable: false,
      arrows: false,
      accessibility: false,
      waitForAnimate: false
    }).on('beforeChange', function(event, slick, currentSlide, nextSlide) {
      $people.eq(nextSlide).addClass('active')
        .siblings().removeClass('active');
    });

    // Toggle people talk
    $('.create-item .people-photo img').on('click', function() {
      var index = $(this).parents('.create-item').index();
      $peopleTalk.stop().slick('slickGoTo', index);
    });
  }

  var article = {
    getInfo: function() {
      var _this = this;
      sprLib.list('Expand Article').items({
        listCols: ['Id', 'Title', 'Translate_x0020_Title', 'Link', 'Banner', 'Article_x0020_Date', 'Description'],
        queryOrderby: 'Article_x0020_Date desc',
      })
        .then(function(arrData) {
          _this.addNode(arrData);
        })
        .catch(function(errMsg) {
          console.error(errMsg);
        });
    },
    addNode: function(resArr) {
      var nodeStr = '';
      $.each(resArr, function(index, item) {
        nodeStr += '<li class="article-item">';
        if (item.Banner) {
          var banner = JSON.parse(item.Banner);
          if (banner.serverUrl && banner.serverRelativeUrl) {
            nodeStr += '<div class="image-wrapper"><img src="'+ (banner.serverUrl+banner.serverRelativeUrl) +'"></div>';
          }
        }
        nodeStr += '<div class="content-wrapper">';
        if (item.Title) {
          nodeStr += '<h4><a target="_blank" href="'+ (item.Link || '#') +'">'+ item.Title +'</a></h4>';
        }
        if (item.Translate_x0020_Title) {
          nodeStr += '<div class="translate-title">'+ item.Translate_x0020_Title +'</div>';
        }
        if (item.Article_x0020_Date) {
          nodeStr += '<div class="article-date"><span>'+ dateFormat(item.Article_x0020_Date) +'</span></div>';
        }
        nodeStr += '</div></li>';
      });
      if (resArr.length > 4) {
        $('.article-container').addClass('more-than-four');
      }
      $('.article-list-block .article-list').append(nodeStr);
    }
  }

  $(document).ready(function() {
    // Photo carousel init
    slickInit();
    // Get article infomation.
    article.getInfo();
    $('.article-container .view-more').click(function() {
      var $articleCon = $('.article-container'),
          textMore = 'View More',
          textLess = 'View Less';
      if ($(this).hasClass('packup')) {
        $articleCon.removeClass('show-all');
        $(this).removeClass('packup')
          .children('span').html(textMore);
      } else {
        $articleCon.addClass('show-all');
        $(this).addClass('packup')
          .children('span').html(textLess);
      }
    });
  });

})(jQuery);