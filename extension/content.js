// Get requirejs to work in content script
require.load = function (context, moduleName, url) {
  var xhr;
  xhr = new XMLHttpRequest();
  xhr.open("GET", chrome.extension.getURL(url) + '?r=' + (new Date()).getTime(), true);
  xhr.onreadystatechange = function (e) {
    if (xhr.readyState === 4 && xhr.status === 200) {
      eval(xhr.responseText);
      context.completeLoad(moduleName)
    }
  };
  xhr.send(null);
}

require(
    ['/lib/password-ninja.js', '/lib/detect.js'],
    function(PasswordNinjaLib, Detect) {

var PasswordNinjaContentScript = function() {
  /*
   * Has to be able to:
   * -Learn Login
   * -Learn Password Change
   * -Auto-Login
   * -Auto-Password Change
   */
  var obj = {
    initialize : function() {
       //setup message port with background page
       this.port = chrome.runtime.connect({'name' : 'content'});
       this.port.onMessage.addListener(_.bind(this.messageListener, this));
    },
    setData : function(data)  {
      //used to set variable values
      $.extend(true, this, data);
    },
    fillPassword : function(data) {
       var $pwd = Detect.findLoginPasswordInput();
       if ($pwd) {
        $pwd.val(data.password);
       }
    },
    messageListener : function(msg) {
      if (typeof msg.command != "undefined") {
        if (typeof msg.data != "undefined") {
          this[msg.command](msg.data);
        } else {
          this[msg.command]();
        }
      }
      console.log(msg);
    },
    messageBackground : function(msg) {
      this.port.postMessage(msg);
    }
  };
  obj.initialize();
  return obj;
};

$(document).ready(function() {
  var script = new PasswordNinjaContentScript();
}, this);

});
