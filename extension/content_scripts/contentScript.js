var PasswordNinjaContentScript = function(port) {
  var obj = {
    tooltipOptions : {
      'username' : 'Enter Username/Email',
      'password' : 'Enter Password',
      'new-password' : 'Enter New Password',
      'old-password' : 'Enter Old Password',
      'click' : 'Click!'
    },
    initialize : function(port) {
       //setup message port with background page
       this.port = port;
       this.port.onMessage.addListener(_.bind(this.messageListener, this));
    },
    startCapture  : function() {
      $(document).on('click', '*', _.bind(this.showTooltip, this));
    },
    messageListener : function(msg) {
      if (typeof msg.sessionid != "undefined") {
        this.sessionid = msg.sessionid;
      }
      if (typeof msg.command != "undefined") {
        this[msg.command]();
      } else {
        console.log(msg);
      }
    },
    messageBackground : function(msg) {
      msg.destination = "background";
      msg.sender = "content";
      if (typeof this.sessionid != "undefined") {
        msg.sessionid = this.sessionid;
      }
      this.port.postMessage(msg);
    },
    showTooltip : function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      var $el = $(evt.currentTarget);
      if ($el.parents('.password-ninja').length > 0) {
        // element is already a password ninja element
        return;
      }
      var createDropdownOption = function(text, action) {
        return '<li data-action="'+action+'">'+text+'</li>';
      }
      //remove any existing tooltips
      $('.password-ninja').remove();
      var $btn = $('<a class="password-ninja-button">PN</a>');
      var dropdown = '<div class="pn-dropdown"><p class="rowTitle">'+
        'What should we do here?</p><ul>';
      for (action in this.tooltipOptions) {
        dropdown += createDropdownOption(this.tooltipOptions[action], action);
      }
      dropdown += '</ul></div>';
      var $dropdown = $(dropdown);
      $dropdown.find('li').on('click', _.bind(function(evt) {
        evt.preventDefault();
        var selector = this.detectSelector($el);
        var action = $(evt.currentTarget).attr('data-action');
        this.messageBackground({
          'type' : 'userAction',
          'data' : {'action' : action, 'selector' : selector}
        });
        $('.password-ninja').remove();
      }, this));
      var $container = $('<span class="password-ninja"></span>');
      $dropdown.hide();
      $btn.click(function(evt) {
        $dropdown.show();
      });
      $container.append($btn, $dropdown);
      $el.after($container);
    },
    detectSelector : function($el) {
      //Determines a unique selector for a given webpage element
      var selectorUnique = function(selector) {
        return $(selector).length === 1;
      }
      var selector = $el.prop("tagName");
      var id = $el.prop('id')
      if (id != null && id != "") {
        selector += "#" + id;
      }
      var type = $el.prop("type");
      if (type != null && type != "") {
        selector += '[type="' + type + '"]';
      }
      var name = $el.prop("name");
      if (name != null && name != "") {
        selector += '[name="' + name + '"]';
      }
      if (selectorUnique(selector)) {
        return selector;
      }
      // add first class if exists
      var classes = $el.prop('class');
      if (classes != null && classes != "") {
        selector += "." + classes.split(/\s+/)[0];
        if (selectorUnique(selector)) {
          return selector;
        }
      }
      if (!selectorUnique(selector)) {
        if ($el.parent().length !== 0) {
          //recurse
          return this.detectSelecor($el.parent()) + " " + selector;
        } else {
          return null;
        }
      }
    }
  };
  obj.initialize(port);
  return obj;
};

chrome.runtime.onConnect.addListener(_.bind(function(port) {
  var script = new PasswordNinjaContentScript(port);
}, this));
