/*
 * Misc. functions used in PasswordNinja
 */
define(
    ['/lib/underscore.js', '/lib/tld.js'],
    function(_, TLD) {

var PasswordNinjaLib = {

  getRandomString : function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < length; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  },
  getHostname: function(url) {
    var parser = document.createElement("a");
    parser.href = url;
    var hostname = parser.hostname;
    // REMOVE TLD
    var tldRemoved = false;
    for (var i in TLD) {
      var pos = hostname.indexOf(TLD[i], hostname.length - TLD[i].length);
      if (pos !== -1) {
        hostname = hostname.substring(0, pos);
        tldRemoved = true;
        break;
      }
    }
    var hArray = hostname.split('.');
    if (tldRemoved && hArray.length > 1) {
      return hArray[hArray.length - 1];
    } else {
      return hArray[hArray.length - 2];
    }
  },

};

return PasswordNinjaLib;

});
