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
            port.onMessage.addListener(_.bind(this.portListener(tabid, port.name), this));
          }, this));
        }
      }, this));
    },
    initTab : function(tabid) {
      if (!(tabid in this.tabs)) {
        this.tabs[tabid] = {
          'state' : 'default',
          'ports' : {},
          'instructions' : [],
        }
      }
    },
    initPopupScript : function(tabid, port) {
      this.initTab(tabid);
      this.tabs[tabid].ports.popup = port;
      var state = this.tabs[tabid].state;
      if (state == "default") {
        port.postMessage({
          "command" : "setOptions",
          "data"    : {
            "options" : [
              {'value' : 'learnLogin',
              'text'  : 'Learn Login'},
              {'value' : 'learnPasswordChange',
              'text'  : 'Learn Password Change'},
              {'value' : 'doLogin',
              'text'  : 'Do Login'},
              {'value' : 'doPasswordChange',
              'text'  : 'Do Password Change'},
            ]
          }
        });
      } else if (state == "learnPasswordChange") {
        port.postMessage({
          "command" : "setOptions",
          "data"    : {
            "options" : [
              {'value' : 'doneLearning',
              'text'  : 'Done Learning'}
            ]
          }
        });
      } else if (state == "learnLogin") {
        port.postMessage({
          "command" : "setOptions",
          "data"    : {
            "options" : [
              {'value' : 'doneLearning',
              'text'  : 'Done Learning'}
            ]
          }
        });
      }
    },
    initContentScript : function(tabid, port) {
      this.initTab(tabid);
      if (typeof port != "undefined") {
        this.tabs[tabid].ports.content = port;
      }
      var state = this.tabs[tabid].state;
      if (state == "default") {
      } else if (state == "learnPasswordChange") {
        this.tabs[tabid].ports.content.postMessage({
          "command" : "learnPasswordChange",
        });
      }
    },
    portListener : function(tabid, type) {
      if (type == "popup") {
        return function(msg) {
          this.handlePopupMessage(tabid, msg);
        }
      } else {
        return function(msg) {
          this.handleContentMessage(tabid, msg);
        }
      }
    },
    handlePopupMessage : function(tabid, msg) {
      if (typeof msg.menuOption != "undefined" && 
          this.popupFunctions.indexOf(msg.menuOption) != -1) {
        this[msg.menuOption](tabid);
      }
      console.log(msg);
    },
    handleContentMessage : function(tabid, msg) {
      if (msg.type === 'userAction') {
        this.tabs[tabid].instructions.push(msg.data);
      }
      console.log(msg);
    },
    getActiveTab : function(callback) {
    },
    popupFunctions : [
      "learnPasswordChange"
    ],
    learnPasswordChange : function(tabid) {
      if (!("content" in this.tabs[tabid].ports)) {
        return false; //error
      }
      this.tabs[tabid].state = "learnPasswordChange";
      this.initContentScript(tabid);
    },
    doPasswordChange : function(tabid) {
      if (!("content" in this.tabs[tabid].ports)) {
        return false; //error
      }
      this.tabs[tabid].state = "doPasswordChange";
      this.initContentScript(tabid);
    }
    doneLearning : function(tabid) {
      this.tabs[tabid].state = "default";
      this.initContentScript(tabid);
    }
  };
  obj.initialize();
  return obj;
};

// main
$(document).ready(function() {
  var script = new BackgroundPage();
});

