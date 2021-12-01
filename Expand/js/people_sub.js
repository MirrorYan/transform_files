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

function addUserInfo(info) {
  var userName = info.FirstName + ' ' + info.Title;
  // Init breadcrumbs
  $('.breadcrumbs-container li.current').html(userName);
  // Init user normal info - Left side
  var $leftside = $('.user-block .left-side');
  var func = info.BU_x002f_Function ? ', ' + info.BU_x002f_Function : '';
  if ($.trim(info.Semesters) !== '') {
    $leftside.prepend('<p class="semesters"><span>' + info.Semesters + '</span></p>');
  }
  $leftside.find('.name').html(userName);
  $leftside.find('.division').html(info.Divisions + func);
  $leftside.find('.post').html(info.Job_x0020_Title);
  var emailStr = '<a class="email-text" href="mailto:'+ info.Email +'">'+ info.Email +'</a>';
  $leftside.find('.email').append(emailStr);
  if (info.Avatar) {
    var imgInfo = JSON.parse(info.Avatar);
    $leftside.find('.avatar').attr('src',imgInfo.serverRelativeUrl);
  }
  // Init company - Right side
  var $company = $('.company-block');
  $company.find('.summary').html(info.Summary);
  $company.find('.description').html(info.Description);
  $company.find('.company-name').html(info.Company_x0020_Name);
  info.Company_x0020_Logo_x0020_Link &&
    $company.find('.company-logo')
      .append('<img src="'+info.Company_x0020_Logo_x0020_Link+'" alt="Logo">');
  
}

function addQA(qstLst, info) {
  var $qaBlock = $('.user-block .qa-block');
  var qstStr = ''
  $.each(qstLst, function(index, item) {
    qstStr += '<li class="qa-item"><div class="question">'+item.Question_x0020_Title
                +'</div><div class="answer">'+info['Answer'+item.Question_x0020_Order]
                +'</div></li>';
  });
  $qaBlock.append(qstStr);

  // Toggle QA
  $(document).on('click', '.qa-block .question', function() {
    $(this).toggleClass('drop')
      .next('.answer')
      .stop()
      .slideToggle();
  });
}


$(document).ready(function () {
  // Set menu active status
  $('.ms-core-listMenu-root').find('li.selected').removeClass('selected')
    .find('.menu-item.selected').removeClass('selected ms-core-listMenu-selected');
  var $activeMenu = $('.ms-core-listMenu-root').find('li.static').eq(1),
      activeText = $activeMenu.find('li.dynamic').eq(0).find('.menu-item-text').html();
  $activeMenu.find('.static.menu-item').addClass('selected')
    .find('.menu-item-text').html(activeText);

  var uid = getUrlParameter('uid');
  if (typeof uid !== 'undefined') {
    sprLib.list('People Finder').items({
      listCols: ['FirstName', 'Title', 'Avatar', 'Email', 'WWID', 'Divisions', 'BU_x002f_Function', 'Job_x0020_Title',
                 'Company_x0020_Name', 'Company_x0020_Logo_x0020_Link', 'Summary', 'Description',
                 'Answer1', 'Answer2', 'Answer3', 'Answer4', 'Semesters'],
      queryFilter: 'Id eq ' + uid,
    })
      .then(function (userInfo) {
        sprLib.list('Question').items({
          listCols: ['Question_x0020_Title', 'Question_x0020_Order'],
          queryOrderby: 'Question_x0020_Order',
        })
          .then(function (questionList) {
            addUserInfo(userInfo[0]);
            addQA(questionList, userInfo[0]);
          })
          .catch(function(errMsg) {console.error(errMsg)});
      })
      .catch(function(errMsg) {console.error(errMsg)});
  }
});