require(
    ['lib/underscore', 'lib/bb'],
    function(underscore, bb) {
  var PageView = bb.BackboneView.extend({
    
    initialize : function(options) {
      this.setElement($('body'));
      this.render();
    },
    events : {
      'click #generate-password' : 'generatePassword'
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
    },
    showError : function(msg) {
      this.$('#generate-error').html(msg);
    },
    showResult : function(msg) {
      this.$('#generate-result').html(msg);
    },
    render : function() {
    },
  });
  var init_page = function() {
    var pageView = new PageView();
  };  

  $(document).ready(init_page);
});
