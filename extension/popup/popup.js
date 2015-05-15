require(
    ['/lib/underscore.js', '/lib/backbone.js', '/lib/sha256.js',
    '/lib/password-ninja.js'],
    function(_, Backbone, sha256, _PasswordNinjaLib) {

  var PopupView = Backbone.View.extend({
    initialize : function() {
      this.setElement($('body'));
      this.render();
    },
    events : {
      'click #generate-password'   : 'generatePassword',
    },
    generatePassword : function(evt) {
      var domain = this.$('#domain').val();
      if (domain == "") {
        this.showResult("");
        this.showError("Please enter the domain (e.g. facebook.com)");
        return;
      }
      var password = this.$('#password').val();
      if (password == "") {
        this.showResult("");
        this.showError("Please enter your master password");
        return;
      }
      var passwordHash = CryptoJS.SHA256(password+domain).toString().substring(0, 16);
      this.showError("");
      this.showResult("Your password is: " + passwordHash);
    },
    showError : function(msg) {
      this.$('#generate-error').html(msg);
    },
    showResult : function(msg) {
      this.$('#generate-result').html(msg);
    },
    render : function() {
      chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        var url = tabs[0].url;
        var hostname = PasswordNinjaLib.getHostname(url);
        $('#domain').val(hostname);
      });
    }
  });
  var init_page = function() {
    var popupView = new PopupView();
  };  
  $(document).ready(init_page);
});
