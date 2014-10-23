//$(document).on('focus', 'input[type="password"]', documentModified);
$(document).on('focus', 'input[type="password"]', checkForLogin);
checkForLogin();
function checkForLogin() {
  var pwd = findLoginPasswordInput();
  if (pwd !== null) {
    $(pwd).css('height', '100px');
  }
}
function documentModified(e) {
  $('a.password-ninja-button').remove();
  $el = $('<a class="password-ninja-button">Encrypt Password</a>');
  $el.click(encryptPressed);
  $el.insertAfter('input[type="password"]');
}
function encryptPressed(evt) {
  var $password = $(evt.currentTarget).siblings('input[type="password"]').not('password-ninja-encrypted');
  var hash = getHash($password.val());
  $password.val(hash);
  $password.addClass('password-ninja-encrypted');
  $password.change(function(evt) {
    $(evt.currentTarget).removeClass('password-ninja-encrypted');
  });
}
function getHash(password) {
    var url = document.URL;
    parser = document.createElement("a");
    parser.href = url;
    var result = parser.hostname + password;
    return CryptoJS.SHA256(result);
}
function findLoginPasswordInput() {
  var regex = /(log|sign)\s*in/i;
  //First, find all visible password inputs
  $pwds = $('input[type="password"]:visible');
  if ($pwds.length < 1) {
    return null;
  }
  if ($pwds.length == 1) {
    return $pwds;
  }
  var depth = 0;
  do {
    for (var i = 0; i < $pwds.length; i++) {
      $pwd = $($pwds[i]);
      if (regex.test(getjQueryString($pwd))) {
        return $pwd;
      }
      $parent = $pwd;
      for (var idepth = 0; idepth < depth; idepth ++) {
        $parent = $parent.parent();
      }
      if ($parent.find('input[type="password"]:visible').length > 1) {
        //not this element
        $pwd.splice(i, 1);
        i--;
      } else if (regex.test(getjQueryString($parent))) {
        return $pwd;
      }
    }
    depth++;
  } while($pwd.length > 0);
  return null;
}
function getjQueryString($el) {
  return $('<div>').append($el.clone()).html(); 
}
function findRelatedInputs($input) {
  $p = $input.parent();
}
