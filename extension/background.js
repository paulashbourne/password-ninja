/*
 * Background script
 */
require(
    [],
    function() {

var BackgroundPage = function() {
  var obj = {
    initialize : function() {
      this.tabs = {};
      //setup port listeners
      chrome.runtime.onConnect.addListener(_.bind(function(port) {
        if (port.name == "content") {
          var tabid = port.sender.tab.id;
          this.initContentScript(tabid, port);
          port.onMessage.addListener(_.bind(this.portListener(tabid, port.name), this));
        } else if (port.name == "popup") {
          chrome.tabs.query({
            'active'        : true,
            'currentWindow' : true
          }, _.bind(function(tabs) {
            var tabid = tabs[0].id;
            this.initPopupScript(tabid, port);
            this.tabs[tabid].tab = tabs[0];
            port.onMessage.addListener(_.bind(this.portListener(tabid, port.name), this));
          }, this));
        }
      }, this));
    },
    initTab : function(tabid) {
      if (!(tabid in this.tabs)) {
        this.tabs[tabid] = {
          'state' : 'default',
          'ports' : {}
        }
      }
    },
    initPopupScript : function(tabid, port) {
      this.initTab(tabid);
      this.tabs[tabid].ports.popup = port;
      var state = this.tabs[tabid].state;
    },
    initContentScript : function(tabid, port) {
      this.initTab(tabid);
      if (typeof port != "undefined") {
        this.tabs[tabid].ports.content = port;
      }
      var state = this.tabs[tabid].state;
      if (state == "default") {
      }
    },
    portListener : function(tabid, type) {
      if (type == "popup") {
        return _.bind(function(msg) {
          this.handlePopupMessage(tabid, msg);
        }, this);
      } else {
        return _.bind(function(msg) {
          this.handleContentMessage(tabid, msg);
        }, this);
      }
    },
    handlePopupMessage : function(tabid, msg) {
      console.log(msg);
      if (typeof msg.command != "undefined") {
        if (this.popupFunctions.indexOf(msg.command) != -1) {
          if (typeof msg.data != "undefined") {
            this[msg.command](tabid, msg.data);
          } else {
            this[msg.command](tabid);
          }
        }
      }
    },
    handleContentMessage : function(tabid, msg) {
      console.log(msg);
      if (typeof msg.command != "undefined") {
        if (this.contentFunctions.indexOf(msg.command) != -1) {
          if (typeof msg.data != "undefined") {
            this[msg.command](tabid, msg.data);
          } else {
            this[msg.command](tabid);
          }
        }
      }
    },
    getActiveTab : function(callback) {
    },
    popupFunctions : [
      "fillPassword"
    ],
    contentFunctions : [
    ],
    fillPassword : function(tabid, data) {
      this.tabs[tabid].ports.content.postMessage({
        'command' : "fillPassword",
        'data' : {
          'password' : data.password
        }
      });
    }
  };
  obj.initialize();
  return obj;
};

  // main
  $(document).ready(function() {
    var script = new BackgroundPage();
  });

});
