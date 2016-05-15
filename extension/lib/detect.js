/*
 * Automatically detect password elements in the page
 */
define(
    ['/lib/underscore.js'],
    function(_) {

var Detect = {
  findLoginPasswordInput : function() {
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
        if (regex.test(this.getjQueryString($pwd))) {
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
        } else if (regex.test(this.getjQueryString($parent))) {
          return $pwd;
        }
      }
      depth++;
    } while($pwd.length > 0);
    return null;
  },
  getjQueryString : function($el) {
    return $('<div>').append($el.clone()).html(); 
  }
};

return Detect;

});
