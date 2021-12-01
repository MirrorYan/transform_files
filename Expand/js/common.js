(function($) {
  'use strict';

  function addNavToFoot() {
    var $navigate = $('.ms-core-listMenu-horizontalBox');
    if (!$navigate.length) return;

    var $insert = $('footer.foot .bottom');
    var $newNav = $navigate.clone(true);
    $insert.append($newNav);
    $insert.find('.ms-listMenu-editLink.static').remove();
    $insert.find('.static.selected').removeClass('selected');

    $('footer.foot').on('mouseover', 'li.dynamic-children', function() {
      $(this).addClass('hover');
    }).on('mouseout', 'li.dynamic-children', function() {
      $(this).removeClass('hover');
    });

    $('.ms-core-listMenu-root>.static:nth-child(3)').children('a.static').attr('target', '_blank');
  }

  $(document).ready(function() {
    addNavToFoot();
  });

})(jQuery)