require(
    ['/lib/backbone.js', '/lib/sha256.js',
    '/lib/password-ninja.js'],
    function(Backbone, sha256, PasswordNinjaLib) {

  var PopupView = Backbone.View.extend({
    initialize : function() {
      this.setElement($('body'));
      this.preparePort();
      this.render();
    },
    setData : function(data) {
      //used to set variable values
      $.extend(true, this, data);
    },
    events : {
      'click #generate-password'   : 'generatePassword',
    },
    generatePassword : function(evt) {
      var domain = this.$('#domain').val().toLowerCase();
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
      this.messageBackground({
        'command' : 'fillPassword',
        'data' : {
          'password' : passwordHash
        }
      });
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
    },
    messageListener : function(msg) {
      console.log(msg);
      if (typeof msg.command != "undefined") {
        if (typeof msg.data != "undefined") {
          this[msg.command](msg.data);
        } else {
          this[msg.command]();
        }
      }
    },
    messageBackground : function(msg) {
      this.port.postMessage(msg);
      console.log(msg);
    },
    preparePort : function() {
      //setup message port with background page
      this.port = chrome.runtime.connect({'name' : 'popup'})
      this.port.onMessage.addListener(_.bind(this.messageListener, this));
    }
  });
  var init_page = function() {
    var popupView = new PopupView();
  };  
  $(document).ready(init_page);
});
