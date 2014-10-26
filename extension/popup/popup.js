require(
    ['underscore', 'backbone'],
    function(_, Backbone) {

  var PopupView = Backbone.View.extend({
    initialize : function() {
      this.setElement($('body'));
      this.$('#learningOptions').hide();
      this.initPort();
    },
    initPort : function() {
      chrome.tabs.query({
        'active'        : true,
        'currentWindow' : true
      }, _.bind(function(tabs) {
        tab = tabs[0];
        //setup message port with background page
        this.port = chrome.runtime.connect({
          'name'    : 'popup-' + tab.id
        });
        this.port.onMessage.addListener(_.bind(this.messageListener, this));
        this.sessionid = null;
      }, this));
    },
    events : {
      'click #learnChangePassword'   : 'learnChangePassword',
      'click #doneLearning'          : 'doneLearning'
    },
    learnChangePassword : function(evt) {
      this.messageBackground({'msg' : "startLearnChangePassword"});
    },
    learnChangePasswordStarted : function(data) {
      this.sessionid = data.sessionid;
      this.$('#learning').hide();
      this.$('#learningOptions').show();
    },
    doneLearning : function(data) {
      this.sessionid = null;
      this.$('#learning').show();
      this.$('#learningOptions').hide();
      this.messageBackground({'msg' : "doneLearning"});
    },
    messageListener : function(msg) {
      if (typeof msg.command != "undefined") {
        this[msg.command](msg.data);
      }
      console.log(msg);
    },
    messageBackground : function(msg) {
      this.port.postMessage(msg);
    }
  });

  // main
  $(document).ready(function() {
    var pageView = new PopupView();
    pageView.render();
  });

});
