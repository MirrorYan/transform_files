var $ = jQuery;

function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
  }
}

/**
 * Init page
 * @param {Object} info 
 */
function pageInit(info) {
  // Init page summary
  $('.page-title h1').html(info.Title);
  $('.page-title .desc').html(info.Description);
  // Init breadcrumbs
  $('.breadcrumbs .current').html(info.Title);
  // Init banner
  var videoPreview = info.Video_x0020_Cover ? 'poster="'+ info.Video_x0020_Cover +'"' : '';
  var mediaStr = info.Video_x0020_Link ? '<video src="'+ info.Video_x0020_Link +'" '+ videoPreview +' controls></video>'
                : info.Image_x0020_Link ? '<img src="'+ info.Image_x0020_Link +'">'
                  : '<img src="">';
  $('.media-wrapper').append(mediaStr);
  // Init detail body
  $('.event-body').append(info.Event_x0020_Body);
}

$(document).ready(function () {
  // Set menu active status
  $('.ms-core-listMenu-root').find('li.selected').removeClass('selected')
    .find('.menu-item.selected').removeClass('selected ms-core-listMenu-selected');
  var $activeMenu = $('.ms-core-listMenu-root').find('li.static').eq(1),
      activeText = $activeMenu.find('li.dynamic').eq(1).find('.menu-item-text').html();
  $activeMenu.find('.static.menu-item').addClass('selected')
    .find('.menu-item-text').html(activeText);

  var rid = getUrlParameter('rid');
  if (typeof rid !== 'undefined') {
    sprLib.list('Event Records').items({
      listCols: ['Date', 'Title', 'Description', 'Video_x0020_Link', 'Video_x0020_Cover', 'Image_x0020_Link', 'Event_x0020_Body'],
      queryFilter: 'Id eq ' + rid + '& Is_x0020_Show eq true',
    })
      .then(function (recordInfo) {
        pageInit(recordInfo[0]);
      })
      .catch(function(errMsg) { console.error(errMsg) });
  }
});