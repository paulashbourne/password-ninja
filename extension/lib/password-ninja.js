/*
 * Misc. functions used in PasswordNinja
 */

var PasswordNinjaLib = {

  getRandomString : function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < length; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  },
  getHostname: function(url) {
    parser = document.createElement("a");
    parser.href = url;
    return parser.hostname;
  },

}
