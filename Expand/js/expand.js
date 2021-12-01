(function($) {
  'use strict';

  function selectOption($ele) {
    var value = $.trim($ele.html()),
        $selectWrapper = $ele.parent().parent(),
        $selected = $selectWrapper.find('.selected');
    if (value === $selected.val()) return;

    var index = $ele.index(),
        $searchInput = $('.expand-searchbox .search-input input');
    $selected.html(value).trigger('click');
    var searchValue = $searchInput.val(),
        searchArr = searchValue.split(' & '),
        finded = false;
    if (index === 0) value = '';
    $selectWrapper.find('.select-option').each(function(index, item) {
      var searchIndex = searchArr.indexOf($.trim($(item).text()));
      if (searchIndex !== -1) {
        searchArr[searchIndex] = value;
        finded = true;
        return false;
      }
    });
    if (!finded) searchArr[searchArr.length ] = value;
    if (searchArr.indexOf('') !== -1) searchArr.splice(searchArr.indexOf(''), 1);
    $searchInput.val(searchArr.join(' & '));
    $('.expand-searchbox input.ms-textLarge')
      .val(searchArr.join(' & '))
      .siblings('.ms-srch-sb-searchLink')
      .trigger('click');
  }

  $(document).on('click', '.expand-select-container .selected, .semesters-select-container .selected', function() {
    $(this).parent().toggleClass('drop');
  }).on('click', '.expand-select .select-option, .semesters-select-container .select-option', function() {
    selectOption($(this));
  }).on('click', '.expand-searchbox .search-input .search-icon', function() {
    // Trigger search
    var $input =  $(this).parents('.expand-searchbox').find('input.ms-textLarge'),
        value = $(this).siblings('input').val();
    if (value == $input.val()) return;
    var selectOption1 = $('.expand-select-container .select-option').eq(0).html();
    $('.expand-select-container .selected').html($.trim(selectOption1));
    $input.val(value).siblings('.ms-srch-sb-searchLink').trigger('click');
  }).on('keydown', '.expand-searchbox .search-input input', function(e) {
    // Tigger search - input Enter
    if (e.keyCode == 13) {
      $(this).siblings('.search-icon').trigger('click');
      return false;
    }
  });

  // Pack up select when click element is not select.
  $('body').on('click', function(e) {
    var $selectBox = $('.expand-searchbox .expand-select-container'),
        $semesterBox = $('.semesters-select-container'),
        target = e.target;
    if (!$selectBox.is(target) && $selectBox.has(target).length === 0) {
      $selectBox.removeClass('drop');
    }
    if (!$semesterBox.is(target) && $semesterBox.has(target).length === 0) {
      $semesterBox.removeClass('drop');
    }
  });

  $(document).ready(function () {
    // Set menu active status
    $('.ms-core-listMenu-root').find('li.selected').removeClass('selected')
      .find('.menu-item.selected').removeClass('selected ms-core-listMenu-selected');
    var $activeMenu = $('.ms-core-listMenu-root').find('li.static').eq(1),
        activeText = $activeMenu.find('li.dynamic').eq(0).find('.menu-item-text').html();
    $activeMenu.find('.static.menu-item').addClass('selected')
      .find('.menu-item-text').html(activeText);
  });

})(jQuery);