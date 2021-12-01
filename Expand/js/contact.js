(function($) {
  'use strict';

  var mailReg = /^([A-Za-z0-9_\-\.\+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,6})$/g;

  function noteValid(text, type) {
    var $form = $('.contact-form'),
        className = 'valid-' + type;
    if ($form.find('[class^=valid-]').length) {
      if (!$form.find('.'+className).length) {
        $form.find('[class^=valid-]')
          .removeClass()
          .addClass(className);
      }
    } else {
      $form.prepend('<div class="'+className+'"></div>');
    }
    $form.find('.'+className).html(text);
  }

  // Validate contact form
  function validate() {
    var $form = $('.contact-form'),
        valid = true;
    // Check input
    $form.find('input[type=text]').each(function() {
      var val = $(this).val();
      if (val === '') {
        valid = false;
        noteValid('The "' + $(this).attr('placeholder') + '" is required!', 'error');
        return false;
      }

      mailReg.lastIndex = 0;
      if ($(this).attr('name') === 'email'
        && !mailReg.test(val)) {
        valid = false;
        noteValid('The "Email" is incorrect!', 'error');
        return false;
      }
    });
    // Check textarea
    if (valid && $form.find('textarea').val() === '') {
      noteValid('The "Message" is required!', 'error');
      valid = false;
    }
    // Pass valid
    if (valid) {
      $form.find('.valid-error').remove();
    }
    return valid;
  }

  var userTitle;
  $(document).ready(function () {
    sprLib.user().info()
      .then(function (objUser) {
        userTitle = objUser.Title;
      });

    // Clear Form
    $('.contact-form .btn.clear').click(function() {
      $('.contact-form').find('input[type=text], textarea').val('');
    });

    // Submit Form
    $('.contact-form .btn.send').click(function() {
      if (!validate()) return;
      var $form = $('.contact-form');
      sprLib.list('Contact Us')
        .create({
          Title: userTitle,
          First_x0020_Name: $form.find('[name=first_name]').val(),
          Last_x0020_Name: $form.find('[name=last_name]').val(),
          Email: $form.find('[name=email]').val(),
          Phone: $form.find('[name=phone]').val(),
          Subject: $form.find('[name=subject]').val(),
          Message: $form.find('[name=message]').val(),
        })
        .then(function (objItem) {
          noteValid('Submitted successfaully!', 'success');
        })
        .catch(function (strErr) {
          console.error(strErr);
        });
    });
  });

})(jQuery);