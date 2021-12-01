(function($) {
  'use strict';

  var monthArr = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  var winHeight = 0,
      winTop = 0;

  function dateFormat(datestr) {
    var date = new Date(datestr);
    var year = date.getFullYear();
    var month = monthArr[date.getMonth()].substring(0, 3);
    return {year: year, month: month};
  }

  /**
   * Add Event into DOM
   * @param {Array} dateArr 
   */
  function addEvent(dateArr) {
    var $list = $('.event-list');
    $.each(dateArr, function(index, item) {
      var date = dateFormat(item.Date),
          timelineStr = '<div class="timeline"><p class="year">'+ date.year +'</p><p class="month">'+ date.month +'</p></div>';
      var upcomingStr = item.Is_x0020_Upcoming ? '<p class="upcoming">Upcoming</p>' : '';
      var videoPreview = item.Video_x0020_Cover ? 'poster="'+ item.Video_x0020_Cover +'"' : '';
      var mediaStr = item.Is_x0020_Upcoming 
            ? '<img class="comingsoon" src="/teams/Innovation-leadership/SiteAssets/images/comingsoon.png" alt="Coming Soon">'
            : item.Video_x0020_Link
              ? '<video class="event-media" src="'+ item.Video_x0020_Link +'" '+ videoPreview +' controls></video>'
              : item.Image_x0020_Link
                ? '<img class="event-media" src="'+ item.Image_x0020_Link +'">'
                : '<img class="event-media default-img" src="/teams/Innovation-leadership/SiteAssets/images/sub_logo.svg" alt="EXPAND">';
      var descStr = item.Description ? '<p class="desc">'+ item.Description +'</p>' : '';
      var eleStr = '<li class="event-list-item"><div class="date-event-content">'+ timelineStr +'<div class="event-content"><h4>'
                    + item.Title +'</h4>'+ upcomingStr + descStr
                    +'</div></div><div class="media-wrapper">'+ mediaStr +'</div></li>';
      $list.append(eleStr);
    });
    $list.find('.event-list-item').eq(0).addClass('active');

    if ($list.find('.event-list-item').length > 4) {
      $list.parent().append('<div class="view-more"><span>View More</span></div>');
      $list.parent().on('click', '.view-more', function() {
        var textMore = 'View More',
            textLess = 'View Less';
        if ($(this).hasClass('packup')) {
          $list.removeClass('show-all');
          $(this).removeClass('packup')
            .children('span').html(textMore);
        } else {
          $list.addClass('show-all');
          $(this).addClass('packup')
            .children('span').html(textLess);
        }
        mediaTop();
      });
    }

    $list.on('mouseenter', '.event-content', function() {
      $(this).parents('.event-list-item')
        .addClass('active')
        .siblings()
        .removeClass('active');
      mediaTop();
    });
  }

  function mediaTop() {
    var $list = $('.event-list');
    if ($list.hasClass('show-all')) {
      eventScroll();
    } else {
      var listHeight = $list.height(),
          $media = $('.event-list-item.active .media-wrapper'),
          top = (listHeight - $media.height()) / 2;
      if (top < 0) top = 0;
      $media.css('top', top);
    }
  }

  /**
   * Event Scroll
   */
  function eventScroll() {
    var $eventWrapper = $('.event-list');
    if (!$eventWrapper.hasClass('show-all')) return;

    var scrollHeight = $eventWrapper.offset().top - winTop;
    if (scrollHeight - winHeight > 0) return;

    var $media = $('.event-list-item.active .media-wrapper'),
        mediaHeight = $media.height(),
        eventHieght = $eventWrapper.height(),
        top = (winHeight - mediaHeight) / 2 - scrollHeight;
    if (top < 30 || top > (eventHieght-mediaHeight-30)) return false;

    $media.css('top', (winHeight - mediaHeight) / 2 - scrollHeight);
  }

  $(document).ready(function () {
    // Set menu active status
    $('.ms-core-listMenu-root').find('li.selected').removeClass('selected')
      .find('.menu-item.selected').removeClass('selected ms-core-listMenu-selected');
    var $activeMenu = $('.ms-core-listMenu-root').find('li.static').eq(1),
        activeText = $activeMenu.find('li.dynamic').eq(1).find('.menu-item-text').html();
    $activeMenu.find('.static.menu-item').addClass('selected')
      .find('.menu-item-text').html(activeText);

    sprLib.list('Event Records').items({
        listCols: ['Id', 'Date', 'Title', 'Description', 'Video_x0020_Link', 'Video_x0020_Cover', 'Image_x0020_Link', 'Is_x0020_Show', 'Is_x0020_Upcoming'],
        queryFilter: 'Is_x0020_Show eq 1',
        queryOrderby: 'Date',
    })
    .then(function(arrData) {
      addEvent(arrData);
    })
    .catch(function(errMsg) {console.error(errMsg)});

    var $bodyWin = $('#s4-workspace');
    winHeight = $bodyWin.height();
    winTop = $bodyWin.offset().top;
    $('#s4-workspace').one('scroll', function() {
      mediaTop();
    });
    $('#s4-workspace').scroll(function() {
      eventScroll();
    });

    $(window).resize(function() {
      winHeight = $bodyWin.height();
    });
  });
})(jQuery);