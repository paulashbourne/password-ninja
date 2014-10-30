require(
    ['underscore', 'backbone'],
    function(_, Backbone) {

  var PopupView = Backbone.View.extend({
    initialize : function() {
      this.setElement($('body'));
      //setup message port with background page
      this.port = chrome.runtime.connect({'name' : 'popup'})
      this.port.onMessage.addListener(_.bind(this.messageListener, this));
    },
    events : {
      'click .popupButton'   : 'menuOptionSelected',
    },
    setData : function(data) {
      //used to set variable values
      $.extend(true, this, data);
    },
    setOptions : function(data) {
      this.$el.html("");
      var options = data.options;
      _.each(options, _.bind(function(option) {
        if (option.type == "div") {
          //do something
        } else {
          this.$el.append(
            '<div class="buttonRow">' +
              '<a href="#" class="popupButton" data-value="'+option.value+'">' +
              '<img class="buttonIcon" src="lock.png">' +
                '<span>'+option.text+'</span>' +
              '</a>' +
            '</div>'
          );
        }
      }, this));
      this.delegateEvents();
    },
    menuOptionSelected : function(evt) {
      this.messageBackground({
        "menuOption" : $(evt.currentTarget).attr('data-value')
      });
      window.close();
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
    }
  });

  // main
  $(document).ready(function() {
    var pageView = new PopupView();
    pageView.render();
  });

});
